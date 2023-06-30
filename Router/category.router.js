const express = require("express")
const router = express.Router();
const categoryModel = require("../model/catogory.model")
router.get("/", async (req, rsp) => {
    await categoryModel.find()
        .then((data) => {
            rsp.status(200).json(data)
        }).catch((err) => {
            rsp.status(400).json(err)
        })
})
router.get("/:name", async (req, rsp) => {
    await categoryModel.findOne({ name: req.params.name })
        .then((data) => {
            rsp.status(200).json(data)
        }).catch((err) => {
            rsp.status(400).json(err)
        })
})
router.post("/", async (req, rsp) => {
    let category = await categoryModel.create({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    }).then((data) => {
        if (!data) {
            rsp.status(404).json("the cetogory cant be created")
        }
        rsp.status(200).json({
            createdCategory: data
        })
    }).catch((err) => {
        rsp.status(400).json({
            error: err
        })
    })
})
router.put("/:id", async (req, rsp) => {
    await categoryModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    }, { new: true })  // new can show the updated data in output
        .then((data) => {
            if (!data) {
                return rsp.status(400).json("category cant  be created")
            }
            rsp.status(200).json({
                updated_data: data
            })
        }).catch((err) => {
            rsp.status(400).json({ error: err })
        })
})
router.delete("/:id", async (req, rsp) => {
    await categoryModel.findOneAndDelete(req.params.id).then((data) => {
        if (data) {
            rsp.status(200).json({
                sucess: true,
                message: "data deleted successfully"
            })
        } else {
            rsp.status(400).json({
                sucess: false,
                message: "data cant be found"
            })
        }
    }).catch((err) => {
        rsp.status(400).json({
            error: err
        })
    })
})
module.exports = router