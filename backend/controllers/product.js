const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); //file system: To access path of file
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "No Product Found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; // {boolean} - default false; to include the extensions of the original files or not
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "problem with file",
      });
    }
    //destructure the fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All fields are compulsory",
      });
    }

    let product = new Product(fields);

    //handle files here
    // console.log(files.photo)
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size must be lesser than 3 mb",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Falied to save file into DB",
        });
      }
      return res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined; // very bulky to load from backend
  return res.json(req.product);
};

//middleware to load bulky files, here, it is photo
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//update controller
//we are creating exact same ui for updation as that of the create product
// then we are saving updated info to the db

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; // {boolean} - default false; to include the extensions of the original files or not
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "problem with file",
      });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields); //takes existing data and add updated data

    //handle files here
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size must be lesser than 3 mb",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    //save to the DB
    product.save((err, updatedProduct) => {
      if (err || !updatedProduct) {
        return res.status(400).json({
          error: "Falied to update product",
        });
      }
      return res.json(updatedProduct);
    });
  });
};

//delete controller
exports.deleteProduct = (req, res) => {
  let product = req.product;
  var pName = product.name;
  product.remove((err, deletedProduct) => {
    //here, product is a mongoose object hence we can invoke remove method on it
    if (err || !deletedProduct) {
      return res.status(400).json({
        error: "Product can't be deleted",
        product,
      });
    }
    return res.json({
      product_name: pName,
      message: "Product is deleted successfully",
    });
  });
};

//product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo") //dont select photo
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "No product found",
        });
      }
      return res.json(products);
    });
};

//middleware
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {  //[opts.updateOne.filter]
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};


//listCategories
exports.getAllUniqueCategories = (req,res) =>{
  Product.distinct("category", {}, (err, category) =>{
    if(err || !category){
      return res.status(400).json({
        error: 'No category found'
      })
    }
    return res.json(category)
  })
}