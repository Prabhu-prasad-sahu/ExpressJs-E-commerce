let mongoose = require("mongoose")


let connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_DATABASE_URL, {
            dbName: "Ecommerceproject"
        })
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB