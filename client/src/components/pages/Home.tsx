import { Outlet, Link } from 'react-router-dom'
import { NavBar } from '../NavBar/NavBar'
import { ChatButton } from '../Buttons/ChatButton'
import styles from './home.module.scss'

import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs'
import Trackicon from '../../assets/svg_icons/track.svg?react';

const Home = () => {
  return (
    <>
      <NavBar/>
      <Breadcrumbs/>
      <section className={styles.section}>
        <Outlet/>
      </section>
      <div className={styles.footerContainer}>
        <Link to='/delivery-terms' className={styles.delivery}>
          <span>Free Delivery</span>
          <Trackicon className={styles.trackIcon}/>
        </Link>
        <ChatButton/>
      </div>
    </>
  )
}

export default Home
