import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons'

import styles from './rating.module.scss'

interface RatingProps {
  count?: number;
  overall: number;
  editable?: boolean;
  onRatingChange?: (value: number) => void;
}

/**
 *
 * @param overall the overall rating
 * @param count the number of ratings for the current product
 * @returns
 */
export const Rating = ({ count, overall, editable=false, onRatingChange }: RatingProps) => {
  const ratingRef = useRef<HTMLDivElement>(null)


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

  const handleTouchMove = () => {

  }

  const handleTouchEnd = () => {

  }

  return (
    <div
      className={styles.ratingsContainer}
      ref={ratingRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      >
      {mapRating(overall)}
      {count && (
        <span>({count})</span>
      )}
    </div>
  )
}
