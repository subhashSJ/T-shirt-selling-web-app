const express = require("express");
const router = express.Router();

const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getStatus,
} = require("../controllers/order");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { updateStock } = require("../controllers/product");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//actual routes
//create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList, //before saving order into db, we are assuring that
  updateStock, //order has been pushed into user's puchaseList and stock info is updated
  createOrder //that is, money is deducted from user's accnt then only process backend
);

//read
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

//status of order
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getStatus
);
router.put(
  "/order/:orderId/status/userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);
module.exports = router;
