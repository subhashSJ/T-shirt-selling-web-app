const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price") //NOTE: Never put comma
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "No Order present in DB",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;  //NOTE: instead of req.profile, we need to put req.profile._id
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err || !order) {
      return res.status(400).json({
        error: "Failed to save your order in DB",
      });
    }
    return res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name email")
        .exec((err, orders) => {
            if (err || !orders) {
                return res.status(400).json({
                  error: "No order present in DB",
                });
              }
              return res.json(orders);
        })
};

exports.updateStatus = () =>{
    Order.findByIdAndUpdate( //i have replace update with findByIdAndUpdate
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order)=>{
            if (err || !order) {
                return res.status(400).json({
                  error: "Failed to update status of your order",
                });
              }
              return res.json(order);
        }
    )
}

exports.getStatus = () =>{
    return res.json(Order.schema.path('status').enumValues)  //Comeback here
}