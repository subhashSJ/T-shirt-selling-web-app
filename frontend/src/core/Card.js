import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import ImageHelper from "./helper/ImageHelper";
import { addItemToCart, removeItemFromCart } from "../core/helper/CartHelper";

const Card = ({
  product,
  addToCart = true,
  removeFromcart = false,
  setReload = (f) => f,
  //function(f){return f}
  reload = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const cardTitle = product ? product.name : "A photo from Google";
  const cardDescription = product ? product.description : "Default Description";
  const cardPrice = product ? product.price : "DEFAULT";

  let history = useHistory();

  const addTocart = () => {
    addItemToCart(product, () => setRedirect(true));
  };

  const getARedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };
  const showAddTocart = (addToCart) => {
    return (
      addToCart && (
        <div className="col-12">
          <button
            onClick={addTocart}
            className="btn btn-block btn-outline-success mt-2 mb-2"
          >
            Add to Cart
          </button>
        </div>
      )
    );
  };

  const showRemoveFromcart = (removeFromcart) => {
    return (
      removeFromcart && (
        <div className="col-12">
          <button
            onClick={() => {
              removeItemFromCart(product._id);
              setReload(!reload);
            }}
            className="btn btn-block btn-outline-danger mt-2 mb-2"
          >
            Remove from cart
          </button>
        </div>
      )
    );
  };
  return (
    <div className="card text-white bg-dark border border-info mt-2">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        {getARedirect(redirect)}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
        <div className="row">
          {showAddTocart(addToCart)}
          {showRemoveFromcart(removeFromcart)}
        </div>
      </div>
    </div>
  );
};

export default Card;
