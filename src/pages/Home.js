import { addDoc, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import fireDB from "../fireConfig";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [filterType, setFilterType] = useState("");

  const { currentUser } = useAuth();

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

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const myProducts = await getDocs(collection(fireDB, "products1"));
      const productsArray = [];
      myProducts.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        productsArray.push(obj);
      });

      setProducts(productsArray);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }



  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="d-flex w-50 searchBar">
          <input
            value={searchKey}
            type="text"
            className="form-control searchBars"
            placeholder="Search Items"
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
          />
          <select
            className="form-control mx-2 mt-3 searchBars"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">-Select Category-</option>
            <option value="fashion">Fashoin</option>
            <option value="mobiles">Mobiles</option>
            <option value="electronics">Electronics</option>
            <option value="gadget">Gadget</option>
            <option value="beauty">Beauty</option>
          </select>
        </div>
        <div className="row">
          {products
            .filter((obj) => obj.name.toLowerCase().includes(searchKey))
            .filter((obj) => obj.category.toLowerCase().includes(filterType))
            .filter((obj) => obj.quantity > 0)
            .map((product) => {
              return (
                <div className="col-md-3">
                  <div className="m-2 p-1 product position-relative">
                    <div className="product-content items">
                      <div className="text-center">
                        <img
                          src={product.imageURL}
                          alt=""
                          className="productImg"
                        />
                      </div>

                      <p>{product.name}</p>
                      <p>Price: {product.price} BDT</p>
                    </div>

                    <div className="product-actions">
                      {/* <h3>{product.price} BDT</h3> */}
                      <div className="d-flex">
                        <button onClick={() => addToCart(product)}>
                          Add to Cart
                        </button>
                        <button
                          onClick={() => navigate(`/productinfo/${product.id}`)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
