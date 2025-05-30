import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'

import styles from './rating.module.scss'


export const Rating = () => {
  return (
    <div className={styles.ratingsContainer}>
      <FontAwesomeIcon className={styles.starIcon} icon={faSolidStar} size="lg" />
      <FontAwesomeIcon className={styles.starIcon} icon={faSolidStar} size="lg" />
      <FontAwesomeIcon className={styles.starIcon} icon={faStar} size="lg" />
    </div>
  )
}
