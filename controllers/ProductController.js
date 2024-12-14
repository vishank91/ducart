const Product = require("../models/Product")
const Newsletter = require("../models/Newsletter")

const fs = require("fs")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        var data = new Product(req.body)
        if (req.files?.length) {
            data.pic = Array.from(req.files).map(x => x.path)
        }
        await data.save()

        let emails = await Newsletter.find({ active: true }, { _id: 0, email: 1 })
        emails.forEach(item => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: item.email,
                subject: "Checkout Our Latest Product : Team Ducart",
                text: `
                        Hello,
                        Checkout Our Latest Product
                        Click on the link below
                        http://localhost:8000/product/${data._id}
                        Team : Ducart
                    `
            }, (error) => {
                if (error)
                    cnsole.log(error)
            })
        })

        let finalData = await Product.findOne({ _id: data._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.send({ result: "Done", data: finalData })
    } catch (error) {
        let errorMessage = {}
        error.errors?.name ? errorMessage['name'] = error.errors?.name?.message : null
        error.errors?.maincategory ? errorMessage['maincategory'] = error.errors?.maincategory?.message : null
        error.errors?.subcategory ? errorMessage['subcategory'] = error.errors?.subcategory?.message : null
        error.errors?.brand ? errorMessage['brand'] = error.errors?.brand?.message : null
        error.errors?.color ? errorMessage['color'] = error.errors?.color?.message : null
        error.errors?.size ? errorMessage['size'] = error.errors?.size?.message : null
        error.errors?.basePrice ? errorMessage['basePrice'] = error.errors?.basePrice?.message : null
        error.errors?.discount ? errorMessage['discount'] = error.errors?.discount?.message : null
        error.errors?.finalPrice ? errorMessage['finalPrice'] = error.errors?.finalPrice?.message : null
        error.errors?.stock ? errorMessage['stock'] = error.errors?.stock?.message : null
        error.errors?.stockQuantity ? errorMessage['stockQuantity'] = error.errors?.stockQuantity?.message : null
        error.errors?.description ? errorMessage['description'] = error.errors?.description?.message : null
        error.errors?.pic ? errorMessage['pic'] = error.errors?.pic?.message : null

        try {
            Array.from(req.files).forEach(x => {
                fs.unlinkSync(x.path)
            })
        } catch (error) { }

        Object.keys(errorMessage).length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.send({ result: "Fail", reason: "Missing Fields", error: errorMessage })
    }
}

async function getRecord(req, res) {
    try {
        const data = await Product.find().sort({ _id: -1 })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.send({ result: "Done", data: data, count: data.length })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
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
        var data = await Product.findOne({ _id: req.params._id })
        if (data) {
            // console.log(req.body)
            data.name = req.body.name ?? data.name
            data.maincategory = req.body.maincategory ?? data.maincategory
            data.subcategory = req.body.subcategory ?? data.subcategory
            data.brand = req.body.brand ?? data.brand
            data.color = req.body.color ?? data.color
            data.size = req.body.size ?? data.size
            data.basePrice = req.body.basePrice ?? data.basePrice
            data.discount = req.body.discount ?? data.discount
            data.finalrPrice = req.body.finalrPrice ?? data.finalrPrice
            data.stock = req.body.stock ?? data.stock
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
            data.description = req.body.description ?? data.description
            data.active = req.body.active ?? data.active

            if (req.files) {
                data.pic.forEach((x) => {
                    if (!(req.body.oldPics?.split(",").includes(x))) {
                       try {
                        fs.unlinkSync(x)
                       } catch (error) {}
                    }
                })
                if (req.body.oldPics === "")
                    data.pic = req.files.map((x) => x.path)
                else
                    data.pic = req.body.oldPics?.split(",").concat(req.files.map((x) => x.path))
            }

            await data.save()

            let finalData = await Product.findOne({ _id: data._id })
                .populate("maincategory", ["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])
            res.send({ result: "Done", data: finalData })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        // console.log(error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function updateQuantityRecord(req, res) {
    try {
        var data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.stock = req.body.stock ?? data.stock
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
            await data.save()

            let finalData = await Product.findOne({ _id: data._id })
                .populate("maincategory", ["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])
            res.send({ result: "Done", data: finalData })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        // console.log(error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}
async function deleteRecord(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.pic?.forEach(x => {
                try {
                    fs.unlinkSync(x)
                } catch (error) { }
            })
            await data.deleteOne()
            res.send({ result: "Done", message: "Record is Deleted" })
        }
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        // console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = {
    getRecord,
    createRecord,
    getSingleRecord,
    updateRecord,
    updateQuantityRecord,
    deleteRecord
}