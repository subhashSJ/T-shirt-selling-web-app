import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import {
  getAllCategories,
  getProduct,
  updateProduct,
} from "./helper/adminapicall";

const UpdateProduct = ({ match }) => {
  let history = useHistory();
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getaRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    updatedProduct,
    getaRedirect,
    formData,
  } = values;

  const preload = (productId) => {
    getProduct(productId)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {

          setValues({
            ...values,
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category.name,
            stock: data.stock,
            formData: new FormData(),
          });
           preloadCategories();
        }
      })
      .catch();
  };

  const preloadCategories = () => {
    getAllCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          categories: data,
          formData: new FormData(),
        });
      }
      console.log(categories);
    });
  };

  useEffect(() => {
    preload(match.params.productId);
  }, []);

  useEffect(() => {
    if (getaRedirect) {
      setTimeout(() => history.push("/admin/dashboard"), 3000);
    }
  });

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value); //sets key value pair
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    updateProduct(match.params.productId, user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: "",
          description: "",
          price: "",
          photo: "",
          stock: "",
          loading: false,
          updatedProduct: data.name,
          getaRedirect: true,
        });
      }
    });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: updatedProduct ? "" : "none" }}
    >
      <h4>{updatedProduct} updated successfully</h4>
    </div>
  );

  //TODO: Work on error message
  const updateProductForm = () => (
    <form className="m-2">
      <span>Post photo</span>
      <div className="form-group mt-2">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="name"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="description"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
          name="category"
        >
          <option selected>{category}</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-2 rounded"
      >
        Update Product
      </button>
    </form>
  );
  return (
    <Base
      title="Update a product here!"
      description="Welcome to product updation section"
      className="conatiner bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {updateProductForm()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateProduct;
