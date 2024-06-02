import React from 'react';
import PizzaImage from '../assets/pizza2.png'; 
import '../styles/Home.css';


function Home() {
  return (
    <div className='Home'>
      <div className='HeaderContainer'>
        <div className="content">
          <div className="text-container">
          <h1>It’s Not Just A Pizza, It’s An <span class="orange-text">Experience</span></h1>
            <p>Experience the perfect blend of traditional Italian cuisine and modern convenience - order your favorite pizza in just a few clicks with our pizza app and let your hunger turn into pure satisfaction!</p>
            <a href="/menu">
              <button>ORDER NOW</button>
            </a>
          </div>
          <div className="image-container">
            <img src={PizzaImage} alt="Pizza" className="pizza-image" /> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

