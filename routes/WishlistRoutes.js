const WishlistRouter = require("express").Router()
const { verifyBoth } = require("../middleware/authentication")

const {
    createRecord,
    getRecord,
    getSingleRecord,
    deleteRecord
} = require("../controllers/WishlistController")

WishlistRouter.post("", verifyBoth, createRecord)
WishlistRouter.get("", verifyBoth, getRecord)
WishlistRouter.get("/:_id", verifyBoth, getSingleRecord)
WishlistRouter.delete("/:_id", verifyBoth, deleteRecord)


module.exports = WishlistRouter