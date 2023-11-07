/// <reference types="vite-plugin-svgr/client" />
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import CartIcon from '../../assets/svg_icons/cart.svg?react'

export const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <h2>Products for you</h2>
      <ul className={styles.leftContainer}>
        <NavLink to="/">Home</NavLink>
      </ul>
      <nav className={styles.rightContainer}>
          <div className={styles.linkContainer}>
            <FontAwesomeIcon 
              icon={faSquare}
              className={styles.icon}
              />
            <NavLink to="/categories">Categories</NavLink>
          </div>
          <div className={styles.linkContainer}>
            <CartIcon
              className={styles.cartIcon}
            />
            {/* <img
              className={`${styles.icon} ${styles.cartIcon}`} 
              src={cartIcon} 
              alt="" /> */}
            <NavLink to="/cart">Cart</NavLink>
          </div>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/purchase-history">Purchase History (not imple)</NavLink>
          <NavLink to="/contact">Contact Us (not imple)</NavLink>
          <NavLink to="/account">Account</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/products">Products</NavLink>
      </nav>
    </div>
  );
};
