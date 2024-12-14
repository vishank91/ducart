const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full Name is Mendatory"]
    },
    username: {
        type: String,
        required: [true, "User Name is Mendatory"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email Address is Mendatory"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Mendatory"]
    },
    password: {
        type: String,
        required: [true, "Password is Mendatory"]
    },
    address: {
        type: String
    },
    pin: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    role: {
        type: String,
        default: "Buyer"
    },
    pic: {
        type: String
    },
    otp: {
        type: Number,
        default: -123453244
    },
    active: {
        type: Boolean,
        default: true
    }
})
const User = new mongoose.model("User", UserSchema)

module.exports = User

