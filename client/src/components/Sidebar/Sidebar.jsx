import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'

const Sidebar = () => {
  return (
    <nav className={styles.sidebarContainer}>
      <ul className='sidebar-left-container'>
        <Link to='/'>Home</Link>
      </ul>
      <ul className='nav-right-container'>
        <li>
          <Link to='/categories'>Categories</Link>
        </li>
        <li>
          <Link to='/cart'>Cart</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='/purchase-history'>Purchase History (not imple)</Link>
        </li>
        <li>
          <Link to='/contact-us'>Contact Us (not imple)</Link>
        </li>
        <li>
          <Link to='/account'>Account</Link>
        </li>
        <li>
          <Link to='/settings'>Settings</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar;