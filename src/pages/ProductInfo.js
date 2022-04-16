/* eslint-disable react-hooks/exhaustive-deps */
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import fireDB from "../fireConfig";

function ProductInfo() {
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const myProduct = await getDoc(
        doc(fireDB, "products1", params.productId)
      );

      setProduct(myProduct.data());
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const addToCart = async (product) => {
    if (currentUser) {
      await addDoc(collection(fireDB, "shoppingCart"), {
        userId: currentUser.uid,
        product: product,
        quantity: 1,
      });
      toast.success("Product added to cart");
    } else {
      toast.error("You have to login first!");
    }
  };

  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4 productInfo">
            {product && (
              <img src={product.imageURL} alt="" className="productInfoImg" />
            )}
          </div>
          <div className="col-md-5 productInfo">
            {product && (
              <div>
                <p>
                  <b>{product.name}</b>
                </p>
                <hr/>
                <p>{product.description}</p>
                <p><b>Price: </b>{product.price} BDT</p>
                <div className="d-flex justify-content-end m-3">
                  <button onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductInfo;
