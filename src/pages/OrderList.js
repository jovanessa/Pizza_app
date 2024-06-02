import React, { useEffect, useState } from 'react';
import "../styles/Cart.css";
import { fetchOrders } from '../api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const ordersData = await fetchOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    getOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <p>{order.name}</p>
            <p>{order.description}</p>
            <p>{order.toppings}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Price: ${order.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;

