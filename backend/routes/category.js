const express = require("express");
const router = express.Router();
// const { check } = require("express-validator");

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Actual routes goes here

//create
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  //TODO: validate category name
  // [check("name", "name should be atleast 3 char").isLength({ min: 3 })],
  createCategory
);

//read
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

//update
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//delete
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
