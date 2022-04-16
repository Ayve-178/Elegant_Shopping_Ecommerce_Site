import {
  addDoc, collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import fireDB from "../fireConfig";

function Cart() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  const updateAddress = () => {
    const addressInfo = {
      name: formData.name,
      address: formData.address,
      contact: formData.contact,
    };

    localStorage.setItem(currentUser.uid, JSON.stringify(addressInfo));
    handleClose();
    toast.success("Address updated!");
  };

  const placeOrder = async (item) => {
    const orderInfo = {
      productId: item.product.id,
      image: item.product.imageURL,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price * item.quantity,
      orderedBy: currentUser.displayName,
      userId: currentUser.uid,
    };

    if (localStorage.getItem(currentUser.uid)) {
      const docRef = doc(fireDB, "products1", orderInfo.productId);
      const productQuantity = await (await getDoc(docRef)).data().quantity;

      if(orderInfo.quantity <= productQuantity) {
        await addDoc(collection(fireDB, "shoppingOrder"), orderInfo);
        toast.success("Order Placed!");

        deleteFromCart(item);

        const updatedQuantity = productQuantity - orderInfo.quantity;
        const productInfo = {
          imageURL: item.product.imageURL,
          name: item.product.name,
          category: item.product.category,
          description: item.product.description,
          price: item.product.price,
          quantity: updatedQuantity,
        }

        await setDoc(doc(fireDB, "products1", item.product.id), productInfo); 
      } else {
        toast.error("Sorry this product is out of stock!");
      }
    } else {
      toast.warning("Please add your adsress first!");
      handleShow();
    }
  };

  useEffect(() => {
    getCartData();
  }, []);

  const getCartData = async () => {
    try {
      setLoading(true);
      const myCart = await getDocs(collection(fireDB, "shoppingCart"));
      const cartArray = [];
      myCart.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        cartArray.push(obj);
      });

      setCart(cartArray);
      setLoading(false);
    } catch (error) {
      toast.error("Something was wrong!");
      setLoading(false);
    }
  };

  const increaseItem = async (item) => {
    const docRef = doc(fireDB, "products1", item.product.id);
    const productQuantity = await (await getDoc(docRef)).data().quantity;

    if (productQuantity > item.quantity) {
      const cartInfo = {
        product: item.product,
        quantity: item.quantity + 1,
        userId: currentUser.uid,
      };
      await setDoc(doc(fireDB, "shoppingCart", item.id), cartInfo);
      getCartData();
    } else {
      toast.error("Sorry this product is out of stock!");
    }
  };

  const decreaseItem = async (item) => {
    if (item.quantity) {
      const cartInfo = {
        product: item.product,
        quantity: item.quantity - 1,
        userId: currentUser.uid,
      };
      await setDoc(doc(fireDB, "shoppingCart", item.id), cartInfo);
      getCartData();
    }
  };

  const deleteFromCart = async (item) => {
    try {
      setLoading(true);
      await deleteDoc(doc(fireDB, "shoppingCart", item.id));
      setLoading(false);
      getCartData();
    } catch (error) {
      toast.error("Something is wrong!");
      setLoading(false);
    }
  };

  return (
    <Layout loading={loading}>
      <div className="d-flex justify-content-end m-3">
        <button onClick={handleShow}>Address</button>
      </div>
      <div className="cartTable">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
              <th>Place Order</th>
            </tr>
          </thead>
          <tbody>
            {cart
              .filter((obj) => obj.userId === currentUser.uid)
              .map((item) => {
                return (
                  <tr>
                    <td>
                      <img
                        src={item.product.imageURL}
                        alt=""
                        height="60"
                        width="60"
                      />
                    </td>
                    <td>{item.product.name}</td>
                    <td>
                      <span>
                        <button onClick={() => decreaseItem(item)}>-</button>
                      </span>
                      <span> &nbsp;{item.quantity}</span>
                      <span>
                        <button onClick={() => increaseItem(item)}>+</button>
                      </span>
                    </td>
                    <td>{item.product.price * item.quantity}</td>
                    <td>
                      {" "}
                      <FaTrash onClick={() => deleteFromCart(item)} />{" "}
                    </td>
                    <td onClick={() => placeOrder(item)} style={{cursor:"pointer"}}>Confirm</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add your address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="registration-form">
            <input
              name="name"
              type="text"
              className="form-control"
              placeholder="name"
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              name="address"
              className="form-control"
              placeholder="address"
              onChange={handleChange}
              value={formData.address}
            />
            <input
              name="contact"
              type="text"
              className="form-control"
              placeholder="contact no"
              onChange={handleChange}
              value={formData.contact}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleClose}>Close</button>
          <button onClick={updateAddress}>Save</button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default Cart;
