const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode')
module.exports = function authenToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(404).json({
            message: 'Token is valid'
        })
    }
    jwt.verify(token, 'taiduong', function (err) {
        if (err) {
            // console.log(err);
            return res.status(401).send('err')
        }
        else {
            next();
        }
    });
}