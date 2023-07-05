let express = require("express")
let router = express.Router()
const orderModel = require("../model/order.model")
const orderItemModel = require("../model/orderItem.model")

router.get("/getorder", async (req, rsp) => {
    const orderList = await orderModel.find().populate("user orderItem").sort({ totalPrice: -1 })

    if (!orderList) {
        return rsp.status(404).json("order not found")
    }
    rsp.status(200).json({ OrderList: orderList })
})
router.get("/getOrderById/:id", async (req, rsp) => {
    const orderList = await orderModel.findById(req.params.id)
        .populate("user", "name")
        .populate({ path: "orderItem", populate: { path: "product", populate: "category" } })

    if (!orderList) {
        return rsp.status(404).json("order not found")
    }
    rsp.status(200).json({ OrderList: orderList })
})
router.post("/createorder", async (req, rsp) => {
    const orderItemList = await Promise.all(req.body.orderItem.map(async (item) => {
        let listItem = await orderItemModel.create({
            quantity: item.quantity,
            product: item.product
        });
        return listItem._id;
    }));
    const totalPriceByOrder = await Promise.all(orderItemList.map(async (item) => {
        let orderitem = await orderItemModel.findById(item).populate("product")
        const totalPriceByProduct = orderitem.product.Price * orderitem.quantity
        return totalPriceByProduct;
    }))
    const totalPrice = totalPriceByOrder.reduce((a, b) => a + b, 0)
    const orderList = await orderModel.create({
        orderItem: orderItemList,
        address: req.body.address,
        city: req.body.city,
        street: req.body.street,
        appartment: req.body.appartment,
        Zip: req.body.Zip,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    if (!orderList) {
        return rsp.status(500).json("order is not created")
    }
    rsp.status(200).json({ order: orderList })
})
router.put("/updateOrder/:id", async (req, rsp) => {
    let updateData = await orderModel.findByIdAndUpdate(req.params.id, {
        status: req.body.status
    }, { new: true })
    if (!updateData)
        return rsp.status(400).json("order cant be created")
    rsp.send(updateData)
})

router.delete("/deleteOrder/:id", async (req, rsp) => {
    let updateData = await orderModel.findByIdAndRemove(req.params.id).then((order) => {
        if (order) {
            order.orderItem.map(async (item) => {
                await orderItemModel.findByIdAndRemove(item)
            })
            return rsp.status(200).json({ message: "deleted successfully" })
        } else {
            return rsp.status(400).json({ message: "order not found" })
        }
    }).catch((err) => {
        return rsp.status(500).json({ success: false, error: err })
    })
})
router.get("/totalPrice", async (req, rsp) => {
    let totalSale = await orderModel.aggregate([
        { $group: { _id: null, totalSale: { $sum: "$totalPrice" } } }
    ])
    if (!totalSale) {
        return rsp.status(400).json({ message: "this order sale cant be generated" })
    }
    rsp.status(200).json({ totalSale: totalSale })
})

module.exports = router