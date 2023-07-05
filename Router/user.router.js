const express = require("express")
const userModel = require("../model/user.model")
const sendEmail = require("../nodeMailer/nodeMail")
let router = express.Router()
let bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.get("/", async (req, rsp) => {
    try {
        let userData = await userModel.find().select("-hasePassword")
        if (!userData) {
            return rsp.status(404).json({ data: "user not found" })
        }
        rsp.status(200).json({ data: userData })
    } catch (error) {
        rsp.json({ Error: error })
    }
})
router.get("/:id", async (req, rsp) => {
    try {
        let userData = await userModel.findById(req.params.id).select("-hasePassword")
        if (!userData) {
            return rsp.status(404).json({ data: "user not found" })
        }
        rsp.status(200).json({ data: userData })
    } catch (error) {
        rsp.json({ Error: error })
    }
})

router.post("/register", async (req, rsp) => {

    try {
        const userAvailability = await userModel.findOne({ email: req.body.email })
        if (!userAvailability) {
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            let userData = await userModel.create({
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                appartment: req.body.appartment,
                Zip: req.body.Zip,
            })
            if (!userData) {
                return rsp.status(404).json({ data: "user not created" })
            }
            const message = "varyfy email please"
            await sendEmail(userData.email, "Verify Email", message);
            // return rsp.send("An Email sent to your account please verify");
            // return rsp.status(200).json({ createdUser: userData })
        }
        rsp.status(501).json("user alrady exist")


    } catch (error) {
        console.log(error);
    }
})
router.post("/login", async (req, rsp) => {
    try {
        let userData = await userModel.findOne({ email: req.body.email })
        let password = req.body.password
        if (!userData) {
            return rsp.status(404).json({ data: "user not found" })
        }
        if (userData && (await bcrypt.compare(password, userData.password))) {
            const token = jwt.sign({
                userid: userData.id,
                isAdmin: userData.isAdmin
            }, process.env.JWT_SECRET,
                { expiresIn: "15m" })
            rsp.status(200).json({
                user: userData.email,
                Token: token
            })
        } else {
            return rsp.status(500).json("please varify your password")
        }
    } catch (error) {
        rsp.status(400).json({ err: error })

    }
})
router.delete("/:id", async (req, rsp) => {
    try {
        let userData = await userModel.findByIdAndDelete(req.params.id)
        if (!userData) {
            return rsp.status(404).json({ data: "user not found" })
        }
        rsp.status(200).json({ deleted_details: userData })
    } catch (error) {
        rsp.json({ Error: error })
    }
})

module.exports = router