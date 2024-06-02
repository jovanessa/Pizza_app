import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PizzaCard = ({ updateCartCount }) => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/pizzas');
        setPizzas(response.data);
      } catch (error) {
        console.error('Error fetching pizzas:', error);
      }
    };

    fetchPizzas();
  }, []);

  const handleOrderClick = async (pizza) => {
    try {
      const orderData = {
        name: pizza.name,
        description: pizza.description,
        image_url: pizza.image_url,
        quantity: 1,
        price: pizza.price
      };
      
      
      const response = await axios.get('http://localhost:3001/orders');
      const existingPizza = response.data.find(item => item.name === pizza.name);
      
      if (existingPizza) {
        
        const updatedOrderData = {
          ...existingPizza,
          quantity: existingPizza.quantity + 1,
          price: existingPizza.price + pizza.price
        };
        await axios.put(`http://localhost:3001/orders/${existingPizza.id}`, updatedOrderData);
      } else {
        
        await axios.post('http://localhost:3001/orders', orderData);
      }

      console.log('Order placed successfully');
      updateCartCount(); 
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className='pizza-container'>
      {pizzas.map((pizza) => (
        <div key={pizza.id} className='pizza-card'>
          <img src={pizza.image_url} alt={pizza.name} width="100" height='100' />
          <h1 className='titles'>{pizza.name}</h1>
          <span className='price'>${pizza.price}</span>
          <p className='desc'>{pizza.description}</p>
          <button className='orderButton' onClick={() => handleOrderClick(pizza)}>Order</button>
        </div>
      ))}
    </div>
  );
};

export default PizzaCard;