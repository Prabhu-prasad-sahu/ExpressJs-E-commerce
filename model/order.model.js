let mongoose = require("mongoose")

const orderModel = mongoose.Schema({
    orderItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orderitem",
        required: true
    }],
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,

    },
    street: {
        type: String,
        default: ""
    },
    appartment: {
        type: String,
        default: ""
    },
    Zip: {
        type: Number,
        default: ""
    },
    phone: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },
    totalPrice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

orderModel.virtual("id").get(function () {
    return this._id.toHexString();
})
orderModel.set("toJSON", {
    virtuals: true
})

module.exports = mongoose.model("order", orderModel)