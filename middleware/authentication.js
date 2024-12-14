const jwt = require("jsonwebtoken")

function verifyBoth(req, res, next) {
    let token = req.headers.authorization
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER)
            next()
        } catch (error) {
            try {
                jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN)
                next()
            } catch (error) {
                res.send({ result: "Fail", reason: "Verification Failed, Please Login" })
            }
        }
    }
    else
        res.send({ result: "Fail", reason: "You Are Not An Authorized Person to Access This API" })
}
function verifyAdmin(req, res, next) {
    let token = req.headers.authorization
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN)
            next()
        } catch (error) {
            res.send({ result: "Fail", reason: "Verification Failed, Please Login" })
        }
    }
    else
        res.send({ result: "Fail", reason: "You Are Not An Authorized Person to Access This API" })
}

module.exports = {
    verifyBoth: verifyBoth,
    verifyAdmin:verifyAdmin
}