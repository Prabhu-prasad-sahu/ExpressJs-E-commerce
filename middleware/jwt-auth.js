const jwt = require("jsonwebtoken")
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const accessTokenSecret = process.env.JWT_SECRET
    if (!authHeader) {
        return res.status(400).json({ message: "please enter Jwt-Token" })
    }
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.send(err);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
module.exports = authenticateJWT