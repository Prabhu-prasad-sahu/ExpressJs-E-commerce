const express = require("express")
const router = express.Router();
const productModel = require("../model/product.model");
const catogoryModel = require("../model/catogory.model");
const mongoose = require("mongoose")
const multer = require("multer")

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error("invalid image type")
        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'Public/upload')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOption = multer({ storage: storage })

//http://localhost:5050/product/?categories=649c0618b93b395864d60661 is used for filter categories
// http://localhost:5050/product/?categories=649c0618b93b395864d60661,649c0b6cbb38bfb78dde469d filter the both category - id
router.get("/", async (req, rsp) => {
    let filter = {}
    if (req.query.categories) {
        filter = { category: req.query.categories.split(",") }
    }
    //populate also get data as per refer id
    //select also get data as per condition
    await productModel.find(filter).populate("category")
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
    await productModel.findById(req.params.id).select("name Price Image -_id")
        .then((data) => {
            rsp.status(200).json(data)
        }).catch((err) => {
            rsp.status(400).json(err)
        })
})
//singel("image") - image is the name in where send data from frontend
router.post("/", uploadOption.single("Image"), async (req, rsp) => {
    try {
        let ValidCategory = await catogoryModel.findById(req.body.category)
        if (!ValidCategory) {
            return rsp.status(404).json("invalid category")
        }
        let filename = req.file.filename
        let basepath = `${req.protocol}://${req.get("host")}/Public/upload/`;
        let category = await productModel.create({
            name: req.body.name,
            Description: req.body.Description,
            richDescription: req.body.richDescription,
            Image: `${basepath}${filename}`,  //"http://localhost:3000/Public/upload/image.jpg"
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
    await productModel.findByIdAndUpdate(req.params.id, {
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
                productLength: productModel.length - 1,
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
    await productModel.findByIdAndDelete(req.params.id).then((data) => {
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

// it display no if item what you given in your params 
router.get("/noOfitem/:count", async (req, rsp) => {

    const count = req.params.count ? req.params.count : 0
    await productModel.find().populate("category").limit(+count)
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
    const Productcount = await productModel.find({ isFeatured: true }).limit(count)
    if (!Productcount) {
        return rsp.status(400).json({
            sucess: false
        })
    }
    rsp.send(Productcount)
})

router.get("/get/count", async (req, rsp) => {
    const productcount = await productModel.countDocuments((count) => count)
    if (!productcount) {
        rsp.status(400).json({ message: false })
    }
    rsp.status(200).json({
        PRODUCTCOUNT: productcount
    })
})



// update image gallary of A this product
router.put("/updateImages/:id", uploadOption.array("images", 10), async (req, rsp) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return rsp.status(400).send("invalid Product id")
    }
    const files = req.files
    let imagesPath = []
    let basepath = `${req.protocol}://${req.get("host")}/Public/upload/`;

    if (files) {
        files.map((file) => {
            imagesPath.push(`${basepath}${file.filename}`)
        })
    }
    let product = await productModel.findByIdAndUpdate(req.params.id, {
        images: imagesPath,
    }, { new: true })
    if (!product) {
        return rsp.status(404).json({
            message: "product cant be updated"
        })
    }
    rsp.send(product)
})

module.exports = router