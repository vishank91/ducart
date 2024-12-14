const ContactUs = require("../models/ContactUs")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        var data = new ContactUs(req.body)
        data.date = new Date()

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: "Your Query Has Been Received : Team Ducart",
            text: `
                    Hello ${data.name}
                    Your Query Has Been Received
                    Our Team Will Contact You Soon
                    Team : Ducart
                `
        }, (error) => {
            // if (error)
            //     console.log(error)
        })

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: "New Contact Us Query Received : Team Ducart",
            html: `
            <table border="2px" cellpadding="10px" cellspacing="0">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>${data.name}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>${data.email}</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>${data.phone}</td>
                    </tr>
                    <tr>
                        <th>Subject</th>
                        <td>${data.subject}</td>
                    </tr>
                    <tr>
                        <th>Message</th>
                        <td>${data.message}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>${data.date}</td>
                    </tr>
                </tbody>
            </table>
            `
        
        }, (error) => {
            // if (error)
                // console.log(error)
        })
        await data.save()
        res.send({ result: "Done", data: data,message:"Thanks to Subscribe Our ContactUs Service" })
    } catch (error) {
        // console.log(error)
        let errorMessage = {}
        error.errors?.name ? errorMessage['name'] = error.errors?.name?.message : null
        error.errors?.email ? errorMessage['email'] = error.errors?.email?.message : null
        error.errors?.phone ? errorMessage['phone'] = error.errors?.phone?.message : null
        error.errors?.subject ? errorMessage['subject'] = error.errors?.subject?.message : null
        error.errors?.message ? errorMessage['message'] = error.errors?.message?.message : null

        Object.keys(errorMessage).length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.send({ result: "Fail", reason: "Missing or Invalid Fields", error: errorMessage })
    }
}

async function getRecord(req, res) {
    try {
        const data = await ContactUs.find().sort({ _id: -1 })
        res.send({ result: "Done", data: data, count: data.length })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await ContactUs.findOne({ _id: req.params._id })
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
        var data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body.active ?? data.active
            await data.save()
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: "Your Query Status Has Been Updated : Team Ducart",
                text: `
                        Hello ${data.name}
                        Your Query Status Has Been Updated
                        Status : ${req.body.active}
                        Team : Ducart
                    `
            }, (error) => {
                // if (error)
                //     console.log(error)
            })
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
        const data = await ContactUs.findOne({ _id: req.params._id })
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