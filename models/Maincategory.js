const mongoose = require("mongoose")

const MaincategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Maincategory Name is Mendatory"],
        unique: true
    },
    pic: {
        type: String,
        required: [true, "Maincategory Pic is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
})
const Maincategory = new mongoose.model("Maincategory", MaincategorySchema)

module.exports = Maincategory

