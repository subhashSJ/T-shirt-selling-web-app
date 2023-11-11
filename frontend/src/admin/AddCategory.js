import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState(""); // i have done some change here
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onsubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //backend request fired
    createCategory(user._id, token, { name }) //NOTE: name should be wrapped in {} because we expect json at backend
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      })
      .catch((err) => console.log(err));
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category created successfully.</h4>;
    }
  };

  const errorMessage = () => {
    if (error) {
      return <h4 className="text-warning">Failed to create category.</h4>;
    }
  };

  const goBack = () => {
    return (
      <div className="mt-5">
        <Link
          className="btn btn-sm btn-info mb-3 rounded"
          to="/admin/dashboard"
        >
          Admin Home
        </Link>
      </div>
    );
  };

  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead text-dark">Enter the category</p>
          <input
            type="text"
            className="form-control my-3"
            onChange={handleChange}
            value={name}
            autoFocus
            required
            placeholder="For Ex. Summer"
          />
          <button onClick={onsubmit} className="btn btn-outline-info rounded">
            Create Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Create a category here"
      description="Add a new category for new t-shirts"
      className="conatiner bg-info p-3"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
