const express = require("express")
const router = express.Router();
const productRouter = require("../model/product.model");
const catogoryModel = require("../model/catogory.model");
const mongoose = require("mongoose")

//http://localhost:5050/product/?categories=649c0618b93b395864d60661 is used for filter categories
// http://localhost:5050/product/?categories=649c0618b93b395864d60661,649c0b6cbb38bfb78dde469d filter the both category - id
router.get("/", async (req, rsp) => {
    let filter = {}
    if (req.query.categories) {
        filter = { category: req.query.categories.split(",") }
    }
    //populate also get data as per refer id
    //select also get data as per condition
    await productRouter.find(filter).populate("category")
        .then((data) => {
            rsp.status(200).json({
                alldata: data
            })
        }).catch((err) => {
            rsp.status(400).json(err)
        })
})
router.get("/:id", async (req, rsp) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return rsp.status(400).send("invalid Product id")
    }
    await productRouter.findById(req.params.id).select("name Price Image -_id")
        .then((data) => {
            rsp.status(200).json(data)
        }).catch((err) => {
            rsp.status(400).json(err)
        })
})
router.post("/", async (req, rsp) => {
    try {
        let ValidCategory = await catogoryModel.findById(req.body.category)
        if (!ValidCategory) {
            return rsp.status(404).json("invalid category")
        }
        let category = await productRouter.create({
            name: req.body.name,
            Description: req.body.Description,
            richDescription: req.body.richDescription,
            Image: req.body.Image,
            images: req.body.images,
            Brand: req.body.Brand,
            Price: req.body.Price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            Rating: req.body.Rating,
            isFeatured: req.body.isFeatured,
            dateCreate: req.body.dateCreate
        })
        if (!category) {
            rsp.status(404).json("the product cant be created")
        }
        rsp.status(200).json({
            Category: category
        })
    } catch (error) {
        rsp.json(error)
    }
})
router.put("/:id", async (req, rsp) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return rsp.status(400).send("invalid Product id")
    }
    let varifycategory = await catogoryModel.findById(req.body.category)
    if (!varifycategory) {
        return rsp.status(400).json("invalid Category")
    }
    await productRouter.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        Description: req.body.Description,
        richDescription: req.body.richDescription,
        Image: req.body.Image,
        images: req.body.images,
        Brand: req.body.Brand,
        Price: req.body.Price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        Rating: req.body.Rating,
        isFeatured: req.body.isFeatured,
        dateCreate: req.body.dateCreate
    }, { new: true })  // new can show the updated data in output
        .then((data) => {
            if (!data) {
                return rsp.status(400).json("invalid Product Id")
            }
            rsp.status(200).json({
                productLength: productRouter.length - 1,
                updated_data: data
            })
        }).catch((err) => {
            rsp.status(400).json({ error: err })
        })
})
router.delete("/:id", async (req, rsp) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return rsp.status(400).send("invalid Product id")
    }
    await productRouter.findByIdAndDelete(req.params.id).then((data) => {
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

router.get("/noOfitem/:count", async (req, rsp) => {

    const count = req.params.count ? req.params.count : 0
    await productRouter.find().populate("category").limit(+count)
        .then((data) => {
            rsp.status(200).json({
                alldata: data
            })
        }).catch((err) => {
            rsp.status(400).json(err)
        })
})


//if is Featured is true then it will be display to clint   
router.get("/get/isFeatured/:count", async (req, rsp) => {
    let count = req.params.count ? req.params.count : 0
    const Productcount = await productRouter.find({ isFeatured: true }).limit(count)
    if (!Productcount) {
        return rsp.status(400).json({
            sucess: false
        })
    }
    rsp.send(Productcount)
})
module.exports = router