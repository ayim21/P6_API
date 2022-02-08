const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            const userId = decodedToken.userId;
            req.auth = { userId };
            if (req.body.userId && req.body.userId !== userId) {
                throw 'Unauthorized request';
            } else {
                next();
            }
        } else {
            throw 'Authentication failed';
        }
    } catch (error) {
        res.status(401).json({ error });
    }
};