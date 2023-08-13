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


//function




app.post('/api/user/register', async (req, res, next) => {
    const { fullname, phone, email, password } = req.body;
    try {
        await User.findOne({ phone: phone }).then(async user => {
            if (!user) {
                let data = {
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    password: password,

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
app.post('/api/user/login', async (req, res, next) => {
    const data = { phone, password } = req.body;

    try {
        await User.findOne({ phone: phone }).then(async user => {
            if (!user) {
                return res.status(300).json({ success: false, msg: "Account is not found" })
            } else {
                if (password == user.password) {
                    const accessToken = jwt.sign({
                        phone: user.phone,
                        email: user.email,
                        fullname: user.fullname
                    }, 'taiduong', {
                        expiresIn: '86400s',
                    });

                    const refreshToken = (Math.random() + 1).toString(36).substring(2);
                    user.refreshToken = refreshToken
                    user.save()
                    // res.cookie('jwt', accessToken, { maxAge: 1000 * 30, httpOnly: true })
                    return res.status(200).json({ success: true, record: user, accessToken, refreshToken })
                } else {
                    return res.status(300).json({ success: false, msg: "Password Incorrect !!!" })
                }
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Server error !' })
    }
});
app.get('/api/user/all-user', authenToken, async (req, res, next) => {
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
app.get('/api/user/logout', authenToken, async (req, res, next) => {
    console.log('logout success');
    return res.status(200).json({ success: true, msg: "logout" })
})
app.post('/api/user/refreshToken', async (req, res, next) => {
    const refreshToken = req.body
    // console.log(refreshToken);

    await User.findOne({ refreshToken: refreshToken.refreshToken }).then(user => {
        if (!user) {
            // console.log('pass');
            return res.status(300).json({ success: false, msg: 'refresh Token invalid' })
        } else {
            // console.log(user);
            const data = {
                phone: user.phone,
                email: user.email,
                fullname: user.fullname
            }
            const accessToken = jwt.sign(data, 'taiduong', {
                expiresIn: '86400s',
            });
            return res.status(200).json({ success: true, accessToken: accessToken })
        }
    })

})

app.listen(port, () => {
    console.log(`Server is running in ${port}`);
})