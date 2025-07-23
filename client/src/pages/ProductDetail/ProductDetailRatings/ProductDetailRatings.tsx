import type { RatingsListData } from '../../../api/types'
import { Rating } from '../../../components/Rating/Rating'
import styles from './productDetailRatings.module.scss'


interface ProductDetailRatingProps {
  data: RatingsListData
}

export const ProductDetailRatings = ({ data }: ProductDetailRatingProps) => {
  console.log(data)
  return (
    <div className={styles.container}>
      <h2>Ratings</h2>
      <div className={styles.overallContainer}>
        <h3>Overall</h3>
        <Rating overall={data.overall} count={data.count}/>
      </div>

      <div className={styles.aspectsAverageContainer}>
          <h3>Overall</h3>
          {data.aspectsAverage.map(aspect => (
            <div className={styles.aspectContainer}>
              <h3>{aspect.aspect}</h3>
              <Rating overall={aspect.average}/>
            </div>
          ))}
      </div>
    </div>
  )
}
