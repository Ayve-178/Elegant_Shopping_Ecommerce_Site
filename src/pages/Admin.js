import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import fireDB from "../fireConfig";

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    imageURL: "",
    category: "",
    description: "",
    quantity: 0,
  });
  const [show, setShow] = useState(false);
  const [add, setAdd] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => {
      return { ...prevProduct, [name]: value };
    });
  };

  const editHandler = (item) => {
    setProduct(item);

    setShow(true);
  };

  const addProduct = async () => {
    try {
      setLoading(true);
      await addDoc(collection(fireDB, "products1"), product);
      setLoading(false);
      handleClose();
      toast.success("Product Added");
      getData();
    } catch (error) {
      toast.error("Add failed");
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    try {
      setLoading(true);
      await setDoc(doc(fireDB, "products1", product.id), product);
      setLoading(false);
      handleClose();
      toast.success("Product Updated");
      getData();
    } catch (error) {
      toast.error("Update failed");
      setLoading(false);
    }
  };

  const deleteProduct = async (item) => {
    try {
      setLoading(true);
      await deleteDoc(doc(fireDB, "products1", item.id));
      toast.success("Product Deleted!");
      setLoading(false);
      getData();
    } catch (error) {
      toast.error("Delete failed");
      setLoading(false);
    }
  };

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

  const addhandler = () => {
    setAdd(true);
    handleShow();
    setProduct([]);
  };

  async function getOrders() {
    try {
      setLoading(true);
      const myOrder = await getDocs(collection(fireDB, "shoppingOrder"));
      const ordersArray = [];
      myOrder.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        ordersArray.push(obj);
      });

      setOrders(ordersArray);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <Layout loading={loading}>
      <Tabs
        defaultActiveKey="products"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="products" title="Products">
          <div className="d-flex justify-content-between p-3">
            <h2>Prouct List</h2>
            <button onClick={addhandler}>Add Product</button>
          </div>
          <div className="productTable">
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => {
                  return (
                    <tr>
                      <td>
                        <img
                          src={item.imageURL}
                          alt=""
                          height="60"
                          width="60"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <FaTrash
                          color="red"
                          size={20}
                          onClick={() => deleteProduct(item)}
                        />
                        <FaEdit
                          className="mx-3"
                          color="blue"
                          size={20}
                          onClick={() => editHandler(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{add ? "Add Product" : "Edit product"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="registration-form">
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="name"
                  onChange={handleChange}
                  value={product.name}
                />
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="description"
                  onChange={handleChange}
                  value={product.description}
                />
                <input
                  name="imageURL"
                  type="text"
                  className="form-control"
                  placeholder="image URL"
                  onChange={handleChange}
                  value={product.imageURL}
                />

                <input
                  name="category"
                  type="text"
                  className="form-control"
                  placeholder="category"
                  onChange={handleChange}
                  value={product.category}
                />

                <input
                  name="price"
                  type="number"
                  className="form-control"
                  placeholder="price"
                  onChange={handleChange}
                  value={product.price}
                />

                <input
                  name="quantity"
                  type="number"
                  className="form-control"
                  placeholder="quantity"
                  onChange={handleChange}
                  value={product.quantity}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={handleClose}>Close</button>
              {add ? (
                <button onClick={addProduct}>Add</button>
              ) : (
                <button onClick={updateProduct}>Update</button>
              )}
            </Modal.Footer>
          </Modal>
        </Tab>
        <Tab eventKey="orders" title="Orders">
          <div className="cartTable">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Ordered By</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .map((item) => {
                    return (
                      <tr>
                        <td>
                          <img src={item.image} alt="" height="60" width="60" />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td>{item.orderedBy}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Tab>
      </Tabs>
    </Layout>
  );
}

export default Admin;
