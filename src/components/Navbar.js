import React from 'react';
import Logo from '../assets/pizza.png';
import '../styles/Navbar.css';
import { Link } from "react-router-dom";

function Navbar({ cartCount, isLoggedIn, handleLogout }) {
  return (
    <div className="navbar">
      <div className="left-navbar">
        <div className="site-name">
          <img src={Logo} alt="Logo" className="navbar-logo" />
          <span>Pizza</span>
          <small>App</small>
        </div>
      </div>
      <div className="right-navbar">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/product">Orders🛒 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}</Link>
        {isLoggedIn ? (
          <Link to="/" onClick={handleLogout}>Logout👨‍💼</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;


