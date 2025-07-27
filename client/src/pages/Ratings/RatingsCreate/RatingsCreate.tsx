import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import styles from './ratingsCreate.module.scss'
import { useGetRatingAspectsFromUuidQuery, useCreateRatingMutation } from "../../../api/productsApi"

import { BaseInput } from "../../../components/Inputs/BaseInput/BaseInput"
import { BaseButton } from "../../../components/Buttons/baseButton/BaseButton"
import { Spinner } from "../../../components/Spinner/Spinner"
import { showNotification } from "../../../components/Notifications/showNotification"
import { Rating } from '../../../components/Rating/Rating'
const enum RatingTypes {
  OVERALL = '1',
  ASPECTS = '2'
}

interface RatingAspect {
  aspect: string;
  score: number
}

const formatInitAspects = (data) => {
  return data.map(({ name }) => ({
    aspect: name,
    score: 0
  }))
}

export const RatingsCreate = () => {
  const { uuid } = useParams()
  const { data, isLoading } = useGetRatingAspectsFromUuidQuery(uuid as string)
  const [submitRating, {  isSuccess: isCreateRatingSuccess, error: createRatingError }] = useCreateRatingMutation()
  const [ratingType, setRatingType] = useState(RatingTypes.OVERALL)
  const [overall, setOverall] = useState<number | null>(null)
  const [ratingAspects, setRatingAspects] = useState<RatingAspect[]>([])
  const [comment, setComment] = useState('')

  // console.log(ratingAspects)
  // console.log(overall)

  // console.log(comment)
  // console.log(data)

  // TODO: THE INITIAL VALUE ON RATING IS .5 IF THE USER LEAVES THE VALUE LIKE THIS THE SERVER WILL GET A NULL VALUE .
  useEffect(() => {
    if (Array.isArray(data)) {
      const initAspects = formatInitAspects(data)
      setRatingAspects(initAspects)
    }
  }, [data])

  useEffect(() => {
    if (!isCreateRatingSuccess) return;

    showNotification({
      message: 'Rating submited, if there is a comment it will be evaluated'
    })
  }, [isCreateRatingSuccess])

  const errorMessage = createRatingError?.data?.message
  useEffect(() => {
    errorMessage && showNotification({
      message: errorMessage,
      type: 'danger'
    })
  }, [errorMessage])

  const handleSetAspect = (aspect: string, value: number) => {
    // server needs values scaled 0 - 10 (value * 2)
    if (aspect === 'overall') {
      setOverall(value * 2)
      return
    }

    setRatingAspects(prev => {
      const updated = prev.map(item => (
        item.aspect === aspect ? { ...item, score: value * 2 } : item
      ))

      const exists = prev.some(item => item.aspect === aspect)
      return exists ? updated : [ ...prev, { aspect, score: value * 2 }]
    })
  }

  const handleChangeRatingType = (type: RatingTypes) => {
    // if overall is active clear the aspects otherwise clear the overall
    // server is handling the situation where overall and aspects are populated
    // and it gives precedence to the calculated overall from the aspects
    if (ratingType === RatingTypes.OVERALL) {
      setOverall(null)
      setRatingType(type)
    } else {
      // TODO: have to set to init
      // setRatingAspects([])
      setRatingType(type)
    }
  }

  const handleCommentChange = (e: React.ChangeEvent) => {
    setComment(e.target.value)
  }

  const ratingComponentWithTitle = (title: string) => {
    return (
      <div className={styles.ratingContainer} key={title}>
        <h3>{title}</h3>
        <Rating editable onRatingChange={(value) => handleSetAspect(title, value)}/>
      </div>
    )
  }

  const renderRatings = () => {
    switch (ratingType) {
      case RatingTypes.OVERALL:
        return ratingComponentWithTitle('overall')
      case RatingTypes.ASPECTS:
        return (
          data?.filter(({name}) => name !== 'overall').map(({ name }) => (
            ratingComponentWithTitle(name)
          ))
        )
      default:
        break;
    }
  }

  const isValid = () => {
    if (ratingType === RatingTypes.OVERALL) {
      return overall !== null
    }

    if (ratingType === RatingTypes.ASPECTS) {
      return Array.isArray(data) &&
        data.filter(({ name }) => name !== 'overall').every(({ name }) => (
          ratingAspects.some(
            rating => rating.aspect === name && rating.score !== null && rating.score > 0
          )
        ))
    }
    return false
  }

  const handleSubmit = () => {
    if (!isValid()) return;

    const submitForm = {
      "product_item_uuid": uuid as string,
      "overall_rating": overall,
      "rating_aspects": ratingAspects,
      "comment": comment
    }

    console.log()

    submitRating(submitForm)
  }

  return (
    <div className={styles.container}>
      <h1>Provide your rating</h1>
      <p>Provide either an overall rating, or rate the different aspcets the product.
        in this case the overall will be calculated based on the average of the different aspects.
      </p>

      <form>
        {/* overall */}
        <div className={styles.radioContainer}>
          <input
            type="radio"
            checked={ratingType === RatingTypes.OVERALL}
            onChange={() => handleChangeRatingType(RatingTypes.OVERALL)}
            />
          <h3>Overall</h3>
        </div>

        <div className={styles.radioContainer}>
          <input
            type="radio"
            checked={ratingType === RatingTypes.ASPECTS}
            onChange={() => handleChangeRatingType(RatingTypes.ASPECTS)}
            />
          <h3>Rating Aspects</h3>
        </div>
        <div className={styles.ratingsContainer}>
          {renderRatings()}
        </div>
        {/* apects */}
        <BaseInput
          type="text-area"
          label='your comment'
          name='comment'
          onChange={handleCommentChange}
        />
      </form>
      <div className={styles.submitContainer}>
        <BaseButton
          onClick={handleSubmit}
        >submit</BaseButton>
      </div>
    </div>
  )
}
