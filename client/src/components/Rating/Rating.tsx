import { useCallback, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons'

import styles from './rating.module.scss'

interface BaseRatingProps {
  count?: number;
}

interface ReadOnlyProps extends BaseRatingProps {
  editable?: false;
  overall: number;
  onRatingChange?: never
}

interface EditableProps extends BaseRatingProps {
  editable: true;
  overall?: never;
  onRatingChange: (value: number) => void;
}

type RatingProps = ReadOnlyProps | EditableProps

/**
 *
 * @param overall the overall rating
 * @param count the number of ratings for the current product
 * @param editable boolean
 * @param onRatingChange callback that return the currentRatingValue on click
 * @returns
 */
export const Rating = ({ count, overall, editable=false, onRatingChange }: RatingProps) => {
  const ratingRef = useRef<HTMLDivElement>(null)
  const [ratingValue, setRatingValue] = useState<number | null>(() => {
    return editable ? 0.5 : overall ?? null
  })
  const [locked, setLocked] = useState(true)
  const [tempRatingValue, setTempRatingValue] = useState(null)

  const calculateRating = (clientX: number) => {
    const ratingContainer = ratingRef.current
    if (!ratingContainer) return null

    const { left, right, width }= ratingContainer.getBoundingClientRect()
    if (clientX < left || clientX > right) return null

    const relativeX = clientX - left
    const stepWidth = width / 10 // from 1 to 5 with .5 step

    const ratingValue = Math.ceil(relativeX / stepWidth) * 0.5

    // user can pass the boundries so a clamp is required
    return Math.min(Math.max(ratingValue, 0.5), 5)
  }


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

  const handlePointerMove = (e: React.PointerEvent) => {
    if (locked) return;
    const rating = calculateRating(e.clientX)
    if (editable && rating) setRatingValue(rating)
    }

  const handleClick = (e: React.MouseEvent) => {
    setLocked(prev => !prev)
    onRatingChange?.(ratingValue as number)
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.ratingsContainer}
        ref={ratingRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // onMouseMove={handlePointerMove}
        // onMouseUp={handlePointerUp}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        // onPointerUp={handlePointerUp}
        >
        {mapRating(ratingValue as number)}
        {count && (
          <span>({count})</span>
        )}
      </div>
        {editable && (
          <div className={styles.ratingValueContainer}>{ratingValue}</div>
        )}
    </div>
  )
}
