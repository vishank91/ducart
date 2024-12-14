const mongoose = require("mongoose")

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Testimonial Name is Mendatory"],
        unique: true
    },
    message:{
        type:String,
        required:[true,"Message Field is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Testimonial Pic is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
})
const Testimonial = new mongoose.model("Testimonial", TestimonialSchema)

module.exports = Testimonial

