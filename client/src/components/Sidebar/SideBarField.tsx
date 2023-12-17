import React, { ReactElement, useState } from 'react'
import styles from './sidebarField.module.scss';
import { NavLink } from 'react-router-dom';


interface SidebarFieldProps {
  title: string,
  icon: ReactElement,
  link: string
}

/**
 *
 * 
 * @param {string} title
 * @param {ReactElement} icon - custom styles can be applied to the component inside the className of the provided component.style has to be inside the module scss file of the parent and not to this component!
 * @param {string} link - link for the NavLink component
 * 
 * @returns 
 */
export const SideBarField = ({ title, icon, link }: SidebarFieldProps) => {
  const [isHovered, setIsHovered] = useState<string | null>(null)
  return (
    <NavLink 
      to={link}
      className={`${styles.linkContainer} ${isHovered && styles.hovered}`}
      onMouseEnter={() => setIsHovered('hovered')}
      onMouseLeave={() => setIsHovered(null)}
      >
      {icon}
      <span>
        {title}
      </span>
    </NavLink>
  )
}
