const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "No category found in DB",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Not Able To Save Category In DB",
      });
    }
    return res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No Category Found in DB",
      });
    }
    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err || !updatedCategory) {
      return res.status(400).json({
        error: "Failed to update a category",
      });
    }
    return res.json(updatedCategory);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;
  var cName = category.name;
  category.remove((err, deletedCategory) => {
    if (err || !deletedCategory) {
      return res.status(400).json({
        error: "Failed to remove a category",
      });
    }
    return res.json({
      category_name: cName,
      message: " is successfully deleted", //TODO: add category name in message
    });
  });
};
