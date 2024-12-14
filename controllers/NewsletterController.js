const Newsletter = require("../models/Newsletter")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        var data = new Newsletter(req.body)
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: "Thanks to Subscribe Our Newsletter Service : Team Ducart",
            text: `
                    Thanks to Subscribe Our Newsletter Service
                    Team : Ducart
                `
        }, (error) => {
            // if (error)
            //     console.log(error)
        })
        await data.save()
        res.send({ result: "Done", data: data,message:"Thanks to Subscribe Our Newsletter Service" })
    } catch (error) {
        // console.log(error)
        let errorMessage = {}
        error.keyValue ? errorMessage['email'] = "Your Email Address is Already Registered" : null
        error.errors?.email ? errorMessage['email'] = error.errors?.email?.message : null

        Object.keys(errorMessage).length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.send({ result: "Fail", reason: "Missing or Invalid Fields", error: errorMessage })
    }
}

async function getRecord(req, res) {
    try {
        const data = await Newsletter.find().sort({ _id: -1 })
        res.send({ result: "Done", data: data, count: data.length })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await Newsletter.findOne({ _id: req.params._id })
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
        var data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body.active ?? data.active
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
        const data = await Newsletter.findOne({ _id: req.params._id })
        await data.deleteOne()
        res.send({ result: "Done", reason: "Record Has Been Deleted" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = {
    getRecord,
    createRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
}