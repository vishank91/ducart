const ProductRouter = require("express").Router()
const { productUploader } = require("../middleware/fileUploader")
const { verifyAdmin, verifyBoth } = require("../middleware/authentication")

const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    updateQuantityRecord
} = require("../controllers/ProductController")

ProductRouter.post("", verifyAdmin, productUploader.array("pic"), createRecord)
ProductRouter.get("", getRecord)
ProductRouter.get("/:_id", getSingleRecord)
ProductRouter.put("/:_id", verifyAdmin, productUploader.array("pic"), updateRecord)
ProductRouter.put("/quantity/:_id", verifyBoth,updateQuantityRecord)
ProductRouter.delete("/:_id", verifyAdmin, deleteRecord)


module.exports = ProductRouter