import React, { useEffect, useState } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/CartHelper";
import Payment from "./Payment";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]); //remounts component whenever reload changes

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>This section is to load products</h2>
        {products.map((product, index) => {
          return (
            <div key={index}>
              <Card
                product={product}
                addToCart={false}
                removeFromcart={true}
                setReload={setReload}
                reload={reload}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const loadCheckout = () => {
    return (
      <div>
        <h2>This section is for Checkout</h2>
      </div>
    );
  };
  return (
    <Base title="Cart" description="Ready To Checkout">
      <div className="row">
        <div className="col-6">
          {products && products.length > 0 ? (
            loadAllProducts(products)
          ) : (
            <h3>Your Cart Is Empty</h3>
          )}
        </div>
        <div className="col-6">
          <Payment products={products} setReload={setReload} reload={reload} />
        </div>
      </div>
    </Base>
  );
};

export default Cart;
