const express = require('express');
const app = express();
const port = 8000;
const database = require('./database');
const User = require('./User');
const bodyParser = require('body-parser');
database.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



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
    const { phone, password } = req.body;
    try {
        await User.findOne({ phone: phone }).then(async user => {
            if (!user) {
                return res.status(300).json({ success: false, msg: "Account is not found" })
            } else {
                if (password == user.password) {
                    return res.status(200).json({ success: true, record: user })
                } else {
                    return res.status(300).json({ success: false, msg: "Password Incorrect !!!" })
                }
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Server error !' })
    }
});






app.listen(port, () => {
    console.log(`Server is running in ${port}`);
})