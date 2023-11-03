import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";


export const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <h2>Products for you</h2>
      <ul className={styles.leftContainer}>
        <NavLink to="/">Home</NavLink>
      </ul>
      <nav className={styles.rightContainer}>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/cart">Cart</NavLink>
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
