const CheckoutRouter = require("express").Router()
const { verifyBoth, verifyAdmin } = require("../middleware/authentication")

const {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    order,
    verifyOrder
} = require("../controllers/CheckoutController")

CheckoutRouter.post("", verifyBoth, createRecord)
CheckoutRouter.get("", verifyAdmin, getRecord)
CheckoutRouter.get("/:_id", verifyBoth, getSingleRecord)
CheckoutRouter.get("/user/:userid", verifyBoth, getUserRecord)
CheckoutRouter.put("/:_id", verifyAdmin, updateRecord)
CheckoutRouter.delete("/:_id", verifyAdmin, deleteRecord)
CheckoutRouter.post("/order", verifyBoth, order)
CheckoutRouter.post("/verify", verifyBoth, verifyOrder)


module.exports = CheckoutRouter