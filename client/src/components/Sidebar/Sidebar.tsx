import type { RootState } from '../../app/store/store';

import { Link, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { useSelector } from 'react-redux';
import { useSroll } from '../../hooks/useScroll';

import { SideBarField } from './SideBarField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';


import { sideBarData } from './sidebarData';

export const Sidebar = () => {
  const navigate = useNavigate()
  const isSideBarHidden = useSelector((state: RootState) => state.ui.isSidebarHidden)
  const { isScrollingDown } = useSroll()


  const navContainerStyles = `
    ${styles.sidebarContainer}
    ${isSideBarHidden ? styles.hidden : ''}
    ${isScrollingDown ? styles.scrolledDown : ''}
  `

  return (
    <div className={navContainerStyles}>
      <div
        onClick={() => navigate('/')}
        className={styles.logoContainer}
        >
        <h2>Products for you</h2>
      </div>
      <nav className={styles.fieldsContainer}>
          {sideBarData.map(({ title, icon, link }) => (
            <SideBarField
              key={title}
              title={title}
              icon={icon}
              link={link}
            />
          ))}
      </nav>
      <div className={styles.footer}>
        <FontAwesomeIcon icon={faFacebook} size='lg'/>
        <FontAwesomeIcon icon={faInstagram} size='lg'/>
        <Link to='/terms-of-use'>Terms of use</Link>
        <Link to='/privacy'>Pricacy Policy</Link>
        <Link to='/payment-return-policies'>Payment & return policies</Link>
      </div>
    </div>
  );
};
