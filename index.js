const express = require("express")
let app = express()
require("dotenv").config()
const morgan = require("morgan")
const Mongo_db = require("./database/db")
const productRouter = require("./Router/product.router")
const categoryRouter = require("./Router/category.router")
const userRouter = require("./Router/user.router")
const cors = require("cors")
const authJwt = require("./middleware/jwt-auth")
const expressjwt = require("./middleware/express-auth")
let { expressjwt: jwt } = require("express-jwt")


let port = process.env.PORT

//cors
app.use(cors())
app.options("*", cors())

//middleware
app.use(express.json())
app.use(morgan('tiny'))
// app.use(expressjwt)
app.get(
    "/protected",
    jwt({ secret: "shhhhhhared-secret", algorithms: ["HS256"] }),
    function (req, res) {
        if (!req.auth.admin) return res.sendStatus(401);
        res.sendStatus(200);
    }
);

// app.use(expressjwt())

//router
app.use("/product", productRouter)
app.use("/category", categoryRouter)
app.use("/user", userRouter)



app.listen(port, () => {
    console.log(`http://localhost:${port}`)
    Mongo_db()
})