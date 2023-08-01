const jwt = require('jsonwebtoken');

module.exports = function authenToken(req, res, next) {
    // const authorizationClient = req.headers['authorization'];
    // const token = authorizationClient && authorizationClient.split(' ')[1]
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401)
    } else {
        try {
            jwt.verify(token, 'taiduong')
            next();
        } catch (e) {
            return res.sendStatus(403)
        }
    }
}