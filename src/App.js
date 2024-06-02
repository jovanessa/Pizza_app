import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from './pages/Home';
import Menu from './pages/menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Order from './pages/OrderTracking';
import Product from './product/product';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios'; 
import OrderList from './pages/OrderList';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/orders');
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);


  const updateCartCount = async () => {
    try {
      const response = await axios.get('http://localhost:3001/orders');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="App">
      <Router>
        <Navbar cartCount={getTotalCartItems()} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/menu" exact render={() => <Menu updateCartCount={updateCartCount} />} />
          <Route path="/product">
            <Product cartItems={cartItems} setCartItems={setCartItems} />
          </Route>
          <Route path="/orderslist" component={OrderList} />
          <Route path="/order" component={Order} />
          <Route path="/register">
            <Register setIsLoggedIn={setIsLoggedIn} />
          </Route>
          <Route path="/login">
            <Login setIsLoggedIn={setIsLoggedIn} />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;