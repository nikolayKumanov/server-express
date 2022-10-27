
const jwt = require('jsonwebtoken')

module.exports = () => (req, res, next) => {
    if (req.headers['x-authorization']) {
        const token = req.headers['x-authorization'];


        try {
            const userData = jwt.verify(token, 'simpleSecret');
            req.user = userData;

            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({ message: 'Invalid access token' })
        }
    } else {
        next()
    }



}
