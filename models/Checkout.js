const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is Mendatory"]
    },
    orderStatus: {
        type: String,
        default: "Order is Placed"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal is Mendatory"]
    },
    shipping: {
        type: Number,
        required: [true, "Shipping Amount is Mendatory"]
    },
    total: {
        type: Number,
        required: [true, "total Amount is Mendatory"]
    },
    rppid: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        default: ""
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product Id is Mendatory"]
            },
            qty: {
                type: Number,
                required: [true, "Quantity is Mendatory"]
            },
            total: {
                type: Number,
                required: [true, "Checkout Total is Mendatory"]
            }
        }
    ]
})
const Checkout = new mongoose.model("Checkout", CheckoutSchema)

module.exports = Checkout

