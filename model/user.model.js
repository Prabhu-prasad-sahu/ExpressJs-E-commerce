const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
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
    }
})
userModel.virtual("id").get(function () {
    return this._id.toHexString();
})
userModel.set("toJSON", {
    virtuals: true
})

module.exports = mongoose.model("User", userModel)