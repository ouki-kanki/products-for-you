import { useState } from 'react'
import { useParams } from "react-router-dom"
import styles from './ratingsCreate.module.scss'
import { useGetRatingAspectsFromUuidQuery } from "../../../api/productsApi"
import { useValidationV2 } from "../../../hooks/validation/useValidationV2"
import { notEmptyValidator } from "../../../hooks/validation/validators"

import { BaseInput } from "../../../components/Inputs/BaseInput/BaseInput"
import { BaseButton } from "../../../components/Buttons/baseButton/BaseButton"
import { Spinner } from "../../../components/Spinner/Spinner"
import { showNotification } from "../../../components/Notifications/showNotification"
import { Rating } from '../../../components/Rating/Rating'
const enum RatingTypes {
  OVERALL = '1',
  ASPECTS = '2'
}

export const RatingsCreate = () => {
  const { uuid } = useParams()
  const { data, isLoading } = useGetRatingAspectsFromUuidQuery(uuid as string)
  console.log("the data", data)
  const [ratingType, setRatingType] = useState(RatingTypes.OVERALL)

  console.log(ratingType)

  return (
    <div className={styles.container}>
      <h1>Provide your rating</h1>

      <form>
        {/* overall */}
        <div className={styles.radioContainer}>
          <input
            type="radio"
            checked={ratingType === RatingTypes.OVERALL}
            onChange={() => setRatingType(RatingTypes.OVERALL)}
            />
          <h3>Overall</h3>
        </div>

        <div className={styles.radioContainer}>
          <input
            type="radio"
            checked={ratingType === RatingTypes.ASPECTS}
            onChange={() => setRatingType(RatingTypes.ASPECTS)}
            />
          <h3>Rating Aspects</h3>
        </div>

        <Rating overall={5}/>


        {/* apects */}
        <BaseInput
          type="text-area"
          label='your comment'
          name='comment'
        />
      </form>
    </div>
  )
}
