import axios from 'axios';

const API_URL = 'http://localhost:3001';


export const placeOrder = async (order) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, order);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};


export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};