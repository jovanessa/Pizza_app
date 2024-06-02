import React from 'react';
import '../styles/menu.css';
import PizzaCard from '../list/PizzaCard';

const Menu = ({ updateCartCount }) => {
  return (
    <div className='container'>
    <div className='menu'>
        <h1 className='menuTitle'>Our menu</h1>
        <p>Explore a world of flavors with our diverse pizza menu.</p>
        <div className='wrapper'>
        <PizzaCard updateCartCount={updateCartCount} />
        </div>
    </div>
    </div>
  );
}


export default Menu;
