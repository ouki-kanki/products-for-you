import React from 'react'
import styles from './footer.module.scss'
import { Link } from 'react-router-dom'
import Trackicon from '../../assets/svg_icons/track.svg?react';
import { ChatButton } from '../../components/Buttons/ChatButton'


export const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <Link to='/delivery-terms' className={styles.delivery}>
        <span>Free Delivery</span>
        <Trackicon className={styles.trackIcon}/>
      </Link>
      <div className={styles.footerLinks}>
        <Link to='/terms-of-use'>Terms of use</Link>
        <Link to='/privacy'>Pricacy Policy</Link>
        <Link to='/payment-return-policies'>Payment & return policies</Link>
      </div>
      <div className={styles.chatBtn}>
        <ChatButton/>
      </div>
  </div>
  )
}
