const jwt = require("jsonwebtoken");
const JWT_SECRET = "hrushikesh44";

function auth(req, res, next){
    const token = req.headers.token;

    const response = jwt.verify(token, JWT_SECRET);

    if(response){
        req.userId = token.userId;
        next();
    } else {
        res.status(404).json({
            message: "Unauhorised"
        })
    }
}

module.exports = {
    auth,
    JWT_SECRET
}