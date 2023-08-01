const express = require('express');
const app = express();
const port = 8000;
const database = require('./database');
const User = require('./User');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authenToken = require('./middleware/auth');
const cookieParser = require('cookie-parser');
database.connect();


app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(cookieParser());



app.post('/api/user/register', async(req, res, next) => {
    const { fullname, phone, email, password } = req.body;
    try {
        await User.findOne({ phone: phone }).then(async user => {
            if (!user) {
                let data = {
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    password: password
                }
                await User(data).save()
                return res.status(200).json({ success: true, record: data })
            } else {
                return res.status(300).json({ success: false, msg: 'Account existed !' })
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Server error !' })
    }
});
app.post('/api/user/login', async(req, res, next) => {
    const data = { phone, password } = req.body;
    const accessToken = jwt.sign(data, 'taiduong', {
        expiresIn: '30s',
    });
    try {
        await User.findOne({ phone: phone }).then(async user => {
            if (!user) {
                return res.status(300).json({ success: false, msg: "Account is not found" })
            } else {
                if (password == user.password) {
                    res.cookie('jwt', accessToken, { maxAge: 1000 * 60 * 60, httpOnly: true })
                    return res.status(200).json({ success: true, record: user, accessToken })
                } else {
                    return res.status(300).json({ success: false, msg: "Password Incorrect !!!" })
                }
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Server error !' })
    }
});
app.get('/api/user/all-user', authenToken, async(req, res, next) => {
    try {
        await User.find().lean().then(async users => {
            if (!users) return res.status(300).json({ success: false, msg: "no user" })
            else {
                return res.status(200).json({ success: true, record: users })
            }
        });
        // return res.json({ data: { user: "taiduong" } });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Server error" })
    }
})
app.get('/api/user/logout', authenToken, async(req, res, next) => {
    await res.clearCookie("jwt");
    return res.status(200).json({ success: true, msg: "logout" })
})

app.listen(port, () => {
    console.log(`Server is running in ${port}`);
})