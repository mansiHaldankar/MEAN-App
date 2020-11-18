const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {
            email: decodedToken.email,
            creatorID: decodedToken.id
        };
        console.log(req.userData);
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth Failed"
        });
    }
};