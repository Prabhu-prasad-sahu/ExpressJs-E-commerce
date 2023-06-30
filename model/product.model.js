const { default: mongoose } = require("mongoose");

const product_Model = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ""
    },
    Image: {
        type: String,
        default: ""
    },
    images: [{
        type: String,
        default: 0
    }],
    Brand: {
        type: String,
        default: ""
    },
    Price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    countInStock: {
        type: Number,
        required: [true, "please enter your Stock"],
        min: 0,
        max: 265
    },
    Rating: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreate: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Product", product_Model)