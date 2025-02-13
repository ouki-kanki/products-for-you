import { useEffect } from 'react'
import { useLazyGetCategoriesQuery } from '../../../api/productsApi'
import { SwiperCarouselV2 } from '../../../components/Carousels/SwiperCarouselV2'
import styles from './featuredCategories.module.scss';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

export const FeaturedCategories = () => {
  const [ trigger, { data } ] = useLazyGetCategoriesQuery()


  useEffect(() => {
    setTimeout(() => {
      trigger('featured')
    }, 500);
  }, [])


  console.log("the featured categories", data)

  return (
    <div className={styles.container}>
      <h2>Featured Categories</h2>
      <div className={styles.carouselContainer}>
        <SwiperCarouselV2
        data={data}
        renderCard={
          (item => (
            <div className={styles.container}>
              <h2 className={styles.title}>{item.name}</h2>
              <div className={styles.imageContainer}>
                <img src={item.icon} alt='category icon' />
              </div>
            </div>
          ))
        }
      />
      <div className={styles.more}>
        <Link to='/categories' >more categories</Link>
      </div>
      </div>
    </div>
  )
}
