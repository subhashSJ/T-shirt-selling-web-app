import React, { useEffect, useState } from "react";
import { getAllProducts } from "../core/helper/coreapicalls";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";

const Home = () =>{
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const loadAllProducts = () => {
    getAllProducts()
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  return (
    <Base title="Home Page" description="Welcome to the Tshirt Store">
      <div className="row">
        <div className="row">
          {products && products.map((product, index)=>{
            return(
              <div key={index} className="col-4 mb-4">
                <Card product={product}/>
              </div>
            )
          })}
        </div>
      </div>
    </Base>
  );
}

export default Home;
