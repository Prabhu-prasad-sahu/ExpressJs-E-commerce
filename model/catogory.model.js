const mongoose = require("mongoose")

const categoryModel = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    icon: {
        type: String
    },
    color: {
        type: String
    }
})

module.exports = mongoose.model("category", categoryModel)