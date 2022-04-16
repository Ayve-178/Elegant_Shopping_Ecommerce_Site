import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import fireDB from "../fireConfig";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  console.log(userId);

  async function getData() {
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
        <div className="cartTable">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(obj => obj.userId === userId).map((item) => {
                return (
                  <tr>
                    <td>
                      <img
                        src={item.image}
                        alt=""
                        height="60"
                        width="60"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
    </Layout>
  );
}

export default Orders;
