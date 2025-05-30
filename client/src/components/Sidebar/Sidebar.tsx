import styles from "./Sidebar.module.scss";
import type { RootState } from '../../app/store/store';

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { sideBarData } from './sidebarData';
import { useSroll } from '../../hooks/useScroll';

import { SideBarField } from './SideBarField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { ToolTip } from '../ToolTip/ToolTip';
import { useWindowSize } from '../../hooks/useWindowSize';

export const Sidebar = () => {
  const navigate = useNavigate()
  const isSideBarHidden = useSelector((state: RootState) => state.ui.isSidebarHidden)
  const { facets, sideBarFieldName } = useSelector((state: RootState) => state.filters)
  const { isScrollingDown } = useSroll()
  // const size = useWindowSize()

  // NOTE: disabled for now do not use tooltips on mobile
  // const isMobile = size[0] < 768
  const isMobile = false;


  const navContainerStyles = `
    ${styles.sidebarContainer}
    ${isSideBarHidden ? styles.hidden : ''}
    ${isScrollingDown ? styles.scrolledDown : ''}
  `

  const renderSideBarField = ({ title, icon, link }) => (
    <SideBarField
    key={title}
    title={title}
    icon={icon}
    link={link}
    name={sideBarFieldName}
    facets={facets}
  />
  )

  return (
    <div className={navContainerStyles}>
      <div
        onClick={() => navigate('/')}
        className={styles.logoContainer}
        >
        <h2 className={styles.logo}>Products for you</h2>
      </div>
      <nav className={styles.fieldsContainer}>
          {sideBarData.map(({ title, icon, link }) => {
            return isMobile ?
            <ToolTip
              message={title}
              showDelay={200 }
            >
              {renderSideBarField({ title, icon, link })}
            </ToolTip> : renderSideBarField({ title, icon, link })
          })}
      </nav>
      <div className={styles.footer}>
        <FontAwesomeIcon icon={faFacebook} size='lg'/>
        <FontAwesomeIcon icon={faInstagram} size='lg'/>
        <div className={styles.footerLinks}>
          <Link to='/terms-of-use'>Terms of use</Link>
          <Link to='/privacy'>Pricacy Policy</Link>
          <Link to='/payment-return-policies'>Payment & return policies</Link>
        </div>
      </div>
    </div>
  );
};
