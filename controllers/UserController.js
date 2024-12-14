const User = require("../models/User")
const bcrypt = require("bcrypt")
const passwordValidator = require('password-validator');
const jwt = require("jsonwebtoken")

const mailer = require("../mailer/index")

const schema = new passwordValidator();

schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have 1 uppercase letter
    .has().lowercase(1)                             // Must have 1 lowercase letter
    .has().digits(1)                                // Must have 1 digit
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
const fs = require("fs")

async function createRecord(req, res) {
    if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async function (err, hash) {
            if (err)
                res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
            else {
                try {
                    var data = new User(req.body)
                    data.password = hash
                    await data.save()
                    mailer.sendMail({
                        from: process.env.MAIL_SENDER,
                        to: data.email,
                        subject: "Account Has Been Created : Team Ducart",
                        text: `
                                    Hello ${data.name},
                                    Account Has Been Created
                                    Team : Ducart
                                `
                    }, (error) => {
                        // if (error)
                        //     console.log(error)
                    })

                    jwt.sign({ data }, process.env.JWT_SECRET_KEY_BUYER, { expiresIn: "15 Days" }, (error, token) => {
                        if (error) {
                            // console.log(error)
                            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                        }
                        else
                            res.send({ result: "Done", data: data, token: token })
                    })
                } catch (error) {
                    // console.log(error)
                    let errorMessage = {}
                    error.keyValue ? errorMessage['username'] = "User Name is Already in Use" : null
                    error.keyValue ? errorMessage['email'] = "Email Address is Already in Use" : null
                    error.errors?.name ? errorMessage['name'] = error.errors?.name?.message : null
                    error.errors?.username ? errorMessage['username'] = error.errors?.username?.message : null
                    error.errors?.email ? errorMessage['email'] = error.errors?.email?.message : null
                    error.errors?.phone ? errorMessage['phone'] = error.errors?.phone?.message : null

                    Object.keys(errorMessage).length === 0 ?
                        res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
                        res.send({ result: "Fail", reason: "Missing or Invalid Fields", error: errorMessage })
                }
            }
        });
    }
    else
        res.send({ result: "Fail", reason: "Invalid Password! It Must Contains atleast 1 Upper Case Alphabet, 1 lower Case Alphabet, 1 Digit, doesn't Contains any space and Length Must be 8-100" })
}

async function getRecord(req, res) {
    try {
        const data = await User.find({}, { name: 1, username: 1, email: 1, phone: 1, password: 1, address: 1, pin: 1, city: 1, state: 1, role: 1 }).sort({ _id: -1 })
        res.send({ result: "Done", data: data, count: data.length })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await User.findOne({ _id: req.params._id }, { name: 1, username: 1, email: 1, phone: 1, password: 1, address: 1, pin: 1, city: 1, state: 1, role: 1, pic: 1 })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updateRecord(req, res) {
    try {
        var data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.phone = req.body.phone ?? data.phone
            data.address = req.body.address ?? data.address
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.state = req.body.state ?? data.state
            data.active = req.body.active ?? data.active
            if (req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
            }
            await data.save()
            res.send({ result: "Done", data: data })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function deleteRecord(req, res) {
    try {
        const data = await User.findOne({ _id: req.params._id })
        if (data) {
            fs.unlinkSync(data.pic)
            await data.deleteOne()
            res.send({ result: "Done", message: "Record is Deleted" })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let key = data.role === "Buyer" ? process.env.JWT_SECRET_KEY_BUYER : process.env.JWT_SECRET_KEY_ADMIN
                jwt.sign({ data }, key, { expiresIn: "15 Days" }, (error, token) => {
                    if (error) {
                        // console.log(error)
                        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                    }
                    else
                        res.send({ result: "Done", data: data, token })
                })
            }
            else
                res.status(401).send({ result: "Fail", reason: "Invalid Username or Password" })
        }
        else
            res.status(401).send({ result: "Fail", reason: "Invalid Username or Password" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            let otp = Number((Math.random() * 1000000).toFixed(0).padEnd(6, "1"))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: "OTP for Password Reset : Team Ducart",
                text: `
                            Hello ${data.name},
                            OTP for Password Reset is ${otp}
                            Never Share OTP with anyone 
                            Team : Ducart
                        `
            }, (error) => {
                // if (error)
                //     console.log(error)
            })

            res.send({ result: "Done", message: "OTP Has Been Sent On Your Registered Email Address" })
        }
        else
            res.status(404).send({ result: "Fail", reason: "User Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (data.otp == req.body.otp)
                res.send({ result: "Done" })
            else
                res.send({ result: "Fail", reason: "Invalid OTP" })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Unauthorized Activity. You Are Not a Valid Person to Access this API" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async function (err, hash) {
                    if (err)
                        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                    else {
                        data.password = hash
                        await data.save()
                        res.send({ result: "Done", message: "Your Password Has Been Reset Successfully" })
                    }
                })
            }
            else
                res.send({ result: "Fail", reason: "Invalid Password! It Must Contains atleast 1 Upper Case Alphabet, 1 lower Case Alphabet, 1 Digit, doesn't Contains any space and Length Must be 8-100" })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Unauthorized Activity. You Are Not a Valid Person to Access this API" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
module.exports = {
    getRecord,
    createRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3
}