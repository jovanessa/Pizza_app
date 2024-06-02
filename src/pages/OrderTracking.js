import "../styles/OrderTracking.css";
import React from "react";
import { useLocation } from "react-router-dom";
import Tracking from '../assets/paid.png';
import Checked from '../assets/checked.png';
import Bake from '../assets/bake.png';
import Bike from '../assets/bike.png';
import Delivered from '../assets/delivered.png';

const Order = () => {
  const location = useLocation();
  const { cartItems, total } = location.state || { cartItems: [], total: 0 };

  const status = 0;
  const statusClass = (index) => {
    if (index - status < 1) return "done";
    if (index - status === 1) return "inProgress";
    if (index - status > 1) return "undone";
  };

  return (
    <div className="container">
      <div className="left">
        <div className="row">
        <div className="space"></div>
        </div>
        <div className="row">
          <div className={statusClass(0)}>
            <img src={Tracking} width={30} height={30} alt='' />
            <span>Payment</span>
            <div className="checkedIcon">
              <img className='checkedIcon' src={Checked} width={20} height={20} alt='' />
            </div>
          </div>
          <div className={statusClass(1)}>
            <img src={Bake} width={30} height={30} alt='' />
            <span>Preparing</span>
            <div className="checkedIcon">
              <img className='checkedIcon' src={Checked} width={20} height={20} alt='' />
            </div>
          </div>
          <div className={statusClass(2)}>
            <img src={Bike} width={30} height={30} alt='' />
            <span>On the Way</span>
            <div className="checkedIcon">
              <img className='checkedIcon' src={Checked} width={20} height={20} alt='' />
            </div>
          </div>
          <div className={statusClass(3)}>
            <img src={Delivered} width={30} height={30} alt='' />
            <span>Delivered</span>
            <div className="checkedIcon">
              <img className='checkedIcon' src={Checked} width={20} height={20} alt='' />
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="wrapper">
          <h2 className="title">CART TOTAL</h2>
          <div className="totalText">
            <b className="totalTextTitle">Subtotal:</b>${total}
          </div>
          <div className="totalText">
            <b className="totalTextTitle">Discount:</b>$0.00
          </div>
          <div className="totalText">
            <b className="totalTextTitle">Total:</b>${total}
          </div>
          <button disabled className="button">PAID</button>
        </div>
      </div>
    </div>
  );
};

export default Order;