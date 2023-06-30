const express = require("express")
const userModel = require("../model/user.model")
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
        let userData = await userModel.create({
            name: req.body.name,
            email: req.body.email,
            hasePassword: bcrypt.hashSync(req.body.hasePassword, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            appartment: req.body.appartment,
            Zip: req.body.Zip,
        })
        if (!userData) {
            return rsp.status(404).json({ data: "user not created" })
        }
        rsp.status(200).json({ createdUser: userData })
    } catch (error) {
        rsp.json({ Error: error })
    }
})
router.post("/login", async (req, rsp) => {
    try {
        let userData = await userModel.findOne({ email: req.body.email })
        if (!userData) {
            return rsp.status(404).json({ data: "user not found" })
        }
        if (userData && bcrypt.compareSync(req.body.hasePassword, userData.hasePassword)) {
            const token = jwt.sign({
                userid: userData.id
            }, process.env.JWT_SECRET,
                { expiresIn: "15m" })
            return rsp.status(200).json({
                user: userData.email,
                Token: token
            })
        } else {
            return rsp.status(500).json("please varify your password")
        }
        // rsp.status(200).json({ createdUser: userData })
    } catch (error) {
        // rsp.status(400).json({ err: error })
        console.log(error);
    }
})
router.delete("/:id", async (req, rsp) => {
    try {
        let userData = await userModel.findByIdAndDelete(req.params.id)
        if (!userData) {
            return rsp.status(404).json({ data: "user not found" })
        }
        rsp.status(200).json({ data: userData })
    } catch (error) {
        rsp.json({ Error: error })
    }
})

module.exports = router