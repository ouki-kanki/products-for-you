import type { RatingsListData } from '../../../api/types'
import { Rating } from '../../../components/Rating/Rating'
import styles from './productDetailRatings.module.scss'
import { SwiperCarousel } from '../../../components/Carousels/SwiperCarousel'
import type { Rating as RatingType } from '../../../api/types'
import { isEmpty } from '../../../utils/objUtils'

interface ProductDetailRatingProps {
  data: RatingsListData
}

export const ProductDetailRatings = ({ data }: ProductDetailRatingProps) => {
  console.log(data.ratings[1])

  // const renderAspect = (aspect) => (
  //   <div className={styles.aspectContainer}>
  //     <h3>{aspect.aspect}</h3>
  //     <
  //   </div>
  // )

  return (
    <div className={styles.container}>
      <h2>Ratings</h2>
      <div className={styles.overallContainer}>
        <h3>Overall</h3>
        <Rating overall={data.overall} count={data.count}/>
      </div>

      <div className={styles.aspectsContainer}>
          <h3>Overall</h3>
          {data.aspectsAverage.map(aspect => (
            <div className={styles.aspectContainer}>
              <h3>{aspect.aspect}</h3>
              <Rating overall={aspect.average}/>
            </div>
          ))}
      </div>

      <div className={styles.ratingsContainer}>
        <SwiperCarousel<RatingType>
          data={data.ratings}
          loop={data.ratings.length >= 3 ? true : false}
          renderCard={
            (rating => (
              <div className={styles.rating} key={rating.username}>
                <h3>{rating.username}</h3>
                <Rating overall={rating.overallScore}/>
                { rating.aspects && !isEmpty(rating.aspects) && (
                  <div className={styles.aspectsContainer}>
                    {Object.entries(rating.aspects).map(([aspect, value ]) => (
                      <div className={styles.aspectContainer}>
                        <h3>{aspect}</h3>
                        <Rating overall={value}/>
                      </div>
                    ))}
                  </div>
                )}

                {rating.comment && !isEmpty(rating.comment as object) && (
                <div className={styles.commentContainer}>
                  <span>'''</span>
                  <span>{rating.comment.text}</span>
                  <span>'''</span>
                </div>
                )}

                {rating.adminResponse && !isEmpty(rating.adminResponse) && (
                  <div className={styles.responseContainer}>
                    <h3>response from owner</h3>
                    <div>{rating.adminResponse.text}</div>
                  </div>
                )}
              </div>
            ))
          }
        />
      </div>
    </div>
  )
}
