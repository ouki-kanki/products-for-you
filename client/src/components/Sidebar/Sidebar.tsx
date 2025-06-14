import { useRef, useEffect } from "react";
import styles from "./Sidebar.module.scss";
import type { RootState } from '../../app/store/store';
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { sideBarData } from './sidebarData';
import { hideSidebar } from "../../features/UiFeatures/UiFeaturesSlice";

import { SideBarField } from './SideBarField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';


export const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isSideBarHidden = useSelector((state: RootState) => state.ui.isSidebarHidden)
  const { facets, sideBarFieldName } = useSelector((state: RootState) => state.filters)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  const sidebarContainerStyles = `
    ${styles.sidebarContainer}
    ${isSideBarHidden ? styles.hidden : ''}
    `
  useEffect(() => {
    const handleCloseSidebar = (e: MouseEvent | TouchEvent) => {
      // console.log("tirgger")
      // _symbol is part of the class for the btn on the navbar that closes the sidebar
      if (!sidebarRef.current
          // || sidebarRef.current.contains(e?.target as Node)
          || e.target instanceof Element && e.target.classList.contains(styles.sidebarContainer)
          || e.target instanceof Element && e.target.className.includes('_symbol')) {
        return
      }
      // console.log("trigger")
      // trigger only on mobile
      if (window.innerWidth < 431) {
        dispatch(hideSidebar())
      }
    }
    if (!isSideBarHidden) {
      document.addEventListener("touchstart", handleCloseSidebar)
    }

    return () => {
      document.removeEventListener("touchstart", handleCloseSidebar)
    }
  }, [])

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
    <div
      ref={sidebarRef}
      className={sidebarContainerStyles}>
      <div className={styles.stickyContainer}>
        <div
          onClick={() => navigate('/')}
          className={styles.logoContainer}
          >
          <h2 className={styles.logo}>Products for you</h2>
        </div>
        <nav className={styles.fieldsContainer}>
            {sideBarData.map(({ title, icon, link }) => (
              renderSideBarField({ title, icon, link })
            ))}
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
    </div>
  );
};
