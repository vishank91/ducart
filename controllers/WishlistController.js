const Wishlist = require("../models/Wishlist")

async function createRecord(req, res) {
    try {
        var data = new Wishlist(req.body)
        await data.save()

        let finalData = await Wishlist.findOne({ _id: data._id }).populate([
            {
                path: "user",
                select: "name username email"
            },
            {
                path: "product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            }
        ])
        res.send({ result: "Done", data: finalData })
    } catch (error) {
        // console.log(error)
        let errorMessage = {}
        error.errors?.user ? errorMessage['user'] = error.errors?.user?.message : null
        error.errors?.product ? errorMessage['product'] = error.errors?.product?.message : null

        Object.keys(errorMessage).length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.send({ result: "Fail", reason: "Missing Fields", error: errorMessage })
    }
}

async function getRecord(req, res) {
    try {
        const data = await Wishlist.find().sort({ _id: -1 }).populate([
            {
                path: "user",
                select: "name username email"
            },
            {
                path: "product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            }
        ])
        res.send({ result: "Done", data: data, count: data.length })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await Wishlist.findOne({ _id: req.params._id }).populate([
            {
                path: "user",
                select: "name username email"
            },
            {
                path: "product",
                select: "name brand color size finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            }
        ])
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deleteRecord(req, res) {
    try {
        const data = await Wishlist.findOne({ _id: req.params._id })
        await data.deleteOne()
        res.send({ result: "Done", reason: "Record Has Been Deleted" })
    } catch (error) {
        // console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = {
    getRecord,
    createRecord,
    getSingleRecord,
    deleteRecord
}