import { ReactElement } from 'react'

import styles from "./Sidebar.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

import HomeIcon from '../../assets/svg_icons/home.svg?react';
import CartIcon from '../../assets/svg_icons/cart.svg?react'
import ClockIcon from '../../assets/svg_icons/clock.svg?react';
import EnvelopeIcon from '../../assets/svg_icons/envelope.svg?react';
import GearIcon from '../../assets/svg_icons/gear.svg?react';
import AccountIcon from '../../assets/svg_icons/account.svg?react';
import PigIcon from '../../assets/svg_icons/pig.svg?react';



interface IsidebarData {
  title: string,
  icon: ReactElement,
  link: string
}


export const sideBarData: IsidebarData[] = [
  {
    title: 'Home',
    icon: <HomeIcon className={styles.icon}/>,
    link: '/'
  },
  {
    title: 'Categories',
    icon: <FontAwesomeIcon icon={faSquare}/>,
    link: '/categories'
  },
  {
    title: 'Products',
    icon: <FontAwesomeIcon icon={faBoxOpen}/>,
    link: '/products'
  },
  {
    title: 'Cart',
    icon: <CartIcon className={styles.icon}/>,
    link: '/cart'
  },
  {
    title: 'Selling',
    icon: <PigIcon className={styles.icon}/>,
    link: '/selling'
  },
  {
    title: 'Profile',
    icon: <AccountIcon className={styles.icon}/>,
    link: '/profile'
  },
  {
    title: 'Purchase History',
    icon: <ClockIcon className={styles.icon}/>,
    link: '/purchase-history'
  },
  {
    title: 'Contact Us',
    icon: <EnvelopeIcon className={styles.icon}/>,
    link: '/contact'
  },
  {
    title: 'Settings',
    icon: <GearIcon className={styles.icon}/>,
    link: '/settings'
  },
]