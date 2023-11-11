const {Order, ProductCart} = require("../models/order");
const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No User was Found In DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined; // we dont want to show salt in req.profile
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      user.salt = undefined; // we dont want to show salt in user
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name") //user: _id and name would be shown in order->user
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order in this account",
        });
      }
      return res.json(order);
    });
};

//Population is way of automatically replacing a path in document with actual documents from other collections.
//E.g. Replace the user id in a document with the data of that user

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //store this in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } }, //we are not using $set here, because its an array
    { new: true }, //used to return updated object from db (err, object)
    (err, purchases) => {
      if (err || !purchases) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};

//TODO: write delete controller
