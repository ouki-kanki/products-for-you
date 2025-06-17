import { useEffect, useRef, useState } from 'react'
import styles from './dropDown.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useClassLister } from '../../../hooks/useClassLister';
import type { SortOption } from '../../../types';

interface DropDownProps {
  label: string;
  options: Array<SortOption>;
  defaultValue: string;
  onChange: (value: string) => void;
}

export const DropDown = ({label, defaultValue,options,onChange}: DropDownProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [selectedValue, setSelectedValue] = useState(() => defaultValue || 'select...')
  const dropDownRef = useRef<HTMLButtonElement>(null)
  const classes = useClassLister(styles)

  // close menu when click outside
  useEffect(() => {
    const hideMenu = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    window.addEventListener('click', hideMenu)
    return () => {
      window.removeEventListener('click', hideMenu)
    }
  }, [])

  const onItemClick = (value: string, label: string) => {
    onChange(value)
    setSelectedValue(label)
  }

  const toggleMenu = () => setShowMenu((prev) => !prev)

  return (
    <div className={styles.container}>
      <label htmlFor="">{label}</label>
      <button
        className={styles.dropDown}
        ref={dropDownRef}
        onClick={toggleMenu}
      >
        <div className={styles.labelContainer}>
          <span className={styles.selectedValue}>{selectedValue}</span>
          <FontAwesomeIcon
            icon={faChevronUp}
            className={classes('icon', `${showMenu ? 'is-active' : ''}`)}
          />
        </div>
        <ul className={classes('menu', `${showMenu ? 'is-active' : ''}`)}>
          {options && options.map(({ label, value }) => (
            <li
              className={styles.menu_item}
              onClick={() => onItemClick(value, label)}
              key={value}>{label}</li>
          ))}
        </ul>
      </button>
    </div>
  )
}
