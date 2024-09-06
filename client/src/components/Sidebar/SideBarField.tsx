import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import styles from './sidebarField.module.scss';
import { NavLink } from 'react-router-dom';
import type { Facets } from '../../api/searchApi';
import { IsEmptyObj } from '@reduxjs/toolkit/dist/tsHelpers';
import { isEmpty } from '../../utils/objUtils';

import { useLocation } from 'react-router-dom'
interface SidebarFieldProps {
  title: string,
  icon: ReactElement,
  link: string,
  name: string;
  facets: Facets;
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
export const SideBarField = ({ title, icon, link, name, facets }: SidebarFieldProps) => {
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const [showNested, setShowNestd] = useState(false)
  const [nestedFields, setNestedfields] = useState({})

  const facets_for_dep = !isEmpty(facets) ? JSON.stringify(facets) : ''
  const location = useLocation()

  const pathAr = location.pathname.split('/')
  const path = pathAr[pathAr.length -1]

  console.log(path, name)


  const getNestedFields = useCallback(() => {
    if (facets_for_dep) {
      const facets = JSON.parse(facets_for_dep)
      const innerKeys = ['name', 'count', 'isActive']

      const transformed = Object.keys(facets).reduce((ac, key) => {
        const arrayOfobj = facets[key].map(ar => {
          return ar.reduce((ac, item, index) => {
            return { ...ac, [innerKeys[index]]: item}
          }, {})
        })
        return {...ac, [key]: arrayOfobj}
      }, {})
      setNestedfields(transformed)
    }
  }, [facets_for_dep])


  useEffect(() => {
    if (title.toLowerCase() === name.toLowerCase()) {
      getNestedFields()
    }
  }, [title, name, getNestedFields])

  return (
    <div className={styles.navFieldContainer}>
      <NavLink
        to={link}
        className={`${styles.linkContainer} ${isHovered && styles.hovered}`}
        onMouseEnter={() => setIsHovered('hovered')}
        onMouseLeave={() => setIsHovered(null)}
        >
        <span className={styles.iconContainer}>
          {icon}
        </span>
        <span className={styles.title}>
          {title}
        </span>
      </NavLink>
      {/* TODO: extract to its own component */}
      {path === name.toLowerCase() && path == title.toLowerCase() && (
        <div className={styles.nestedFieldContainer}>
          {!isEmpty(nestedFields) && (
            Object.keys(nestedFields).map((field, i) => (
              <div key={i}>
                <h3>{field}</h3>
                {nestedFields[field].map((item, i) => (
                  <div key={i}>{item.name}- {item.count}</div>
                ))}
              </div>
            ))
          )}
          {/* {Object.keys(nestedFields()).map(field => (
            <div>{field}</div>
            // <ul></ul>
          ))} */}
          <ul>
            <li>yo</li>
            <li>yo</li>
            <li>yo</li>
          </ul>
        </div>
      )}
    </div>
  )
}
