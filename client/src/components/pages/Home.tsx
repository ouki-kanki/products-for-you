import { Outlet } from 'react-router-dom'
import { NavBar } from '../NavBar/NavBar'
import { ChatButton } from '../Buttons/ChatButton'
import styles from './home.module.scss'

import Trackicon from '../../assets/svg_icons/track.svg?react';

const Home = () => {
  return (
    <>
      <NavBar/>
      <section className={styles.section}>
        <Outlet/>
      </section>
      <div className={styles.footerContainer}>
        <div className={styles.delivery}>
          <span>Free Delivery</span>
          <Trackicon className={styles.trackIcon}/>
        </div>
        <ChatButton/>        
      </div>
    </>
  )
}

export default Home