import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/CartHelper";
import { createOrder } from "./helper/OrderHelper";
import { getMeToken, processPayment } from "./helper/PaymentHelper";
import DropIn from "braintree-web-drop-in-react";

const Payment = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getMeToken(userId, token)
      .then((data) => {
        if (data.error) {
          setInfo({ ...info, error: data.error });
        } else {
          const clientToken = data.clientToken;
          setInfo({
            clientToken,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const showDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-block btn-success" onClick={onPurchase}>
              Buy
            </button>
          </div>
        ) : (
          <h3>Please Log In OR Add Something To Cart</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });
          console.log("PAYMENT SUCCESS");
           const orderData = {
               products: products,
               transaction_id: response.transaction.id,
               amount: response.transaction.amount,
           }
           createOrder(userId, token, orderData)
          cartEmpty(() =>{
              console.log("Did we got a crash?");
          })
          setReload(!reload)
        })
        .catch((err) => {
          setInfo({ loading: false, success: false });
          console.log("PAYMENT FAILED");
        });
    });
  };

  const getAmount = () => {
    let amount = 0;
    {
      products &&
        products.map((product) => {
          amount += product.price;
        });
    }
    return amount;
  };

  return (
    <div>
      <h3>Your bill is: {getAmount()} $</h3>
      {showDropIn()}
    </div>
  );
};

export default Payment;
