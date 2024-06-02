import React, { useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../styles/product.css';
import PizzaImage from '../assets/empty_cart.png'; 

const Product = ({ cartItems, setCartItems }) => {
  const history = useHistory();

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/orders');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/orders/${id}`);
      fetchCartItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    return total.toFixed(2);
  };

  const handleOrder = () => {
    history.push('/order', { cartItems, total: calculateTotal() });
  };

  const handleAddToCart = async (product) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity++;
      setCartItems(updatedCartItems);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        image_url: product.image_url,
        quantity: 1,
        price: product.price
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">
        My Cart 
        {cartItems.length > 0 && <span className="cart-count">({cartItems.length})</span>}
      </h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img src={PizzaImage} alt="Empty Cart" />
          <p>Your cart is empty</p>
          <button onClick={() => history.push('/menu')}>Go to Menu</button>
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td><img src={item.image_url} alt={item.name} width="80px" height="80px" /></td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${parseFloat(item.price).toFixed(2)}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>Delete🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <h3>Total: <span className="total">${calculateTotal()}</span></h3>
            <button onClick={handleOrder}>Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
