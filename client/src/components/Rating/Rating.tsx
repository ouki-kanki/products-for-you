import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons'

import styles from './rating.module.scss'

interface RatingProps {
  num: number
  numberOfRatings: number
}

export const Rating = ({ num, numberOfRatings }: RatingProps) => {
  const mapRating = (number: number) => {
    if (!number) {
      return 'no ratings yet'
    }

    const solidStarsNumberArray = Array.from({length: Math.floor(number)})
    const stars = solidStarsNumberArray.map((_, index) => (

        <FontAwesomeIcon
          className={styles.starIcon}
          key={index}
          icon={faSolidStar}
          size='lg'/>
    ))

    if (!Number.isInteger(number)) {
      stars.push(
        <FontAwesomeIcon
          key={'half-star'}
          className={styles.starIcon}
          icon={faStarHalfAlt}
          size='lg'/>
      )
    }

    const countOfStars = stars.length
    const remaingStarsNumber = 5 - countOfStars

    if (remaingStarsNumber > 0) {
      const emptyStars = Array.from({length: remaingStarsNumber}).map((_, index) => (
        <FontAwesomeIcon
        className={styles.starIcon}
        key={5 + index}
        icon={faStar}
        size='lg'/>
      ))

      return stars.concat(emptyStars)
    }
    return stars
  }

  return (
    <div className={styles.ratingsContainer}>
      {mapRating(num)}
      {numberOfRatings && (
        <span>({numberOfRatings})</span>
      )}
    </div>
  )
}
