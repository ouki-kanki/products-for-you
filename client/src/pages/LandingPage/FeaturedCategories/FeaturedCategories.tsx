import { SwiperCarouselV2 } from '../../../components/Carousels/SwiperCarouselV2'
import styles from './featuredCategories.module.scss';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom'

// TODO: type the props
export const FeaturedCategories = ({data, isLoading, isError}) => {
  const navigate = useNavigate()

  const handleCategoryClick = (slug: string) => {
        // todo:  dry same logic in categories component
        navigate({
          pathname: 'search',
          search: createSearchParams({
            category: slug
          }).toString()
        })
  }

  if (isLoading) {
    return (
      <div>isLoding</div>
    )
  }

  if (isError) {
    return (
      <div>isError</div>
    )
  }


  return (
    <div className={styles.container}>
      <h2>Featured Categories</h2>
      {data && data.length > 0 && (
        <div className={styles.carouselContainer}>
          <SwiperCarouselV2
          data={data}
          renderCard={
            (item => (
              <div
                className={styles.categoryContainer}
                onClick={() => handleCategoryClick(item.slug)}
                >
                <h2 className={styles.categoryTitle}>{item.name}</h2>
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
      )}
    </div>
  )
}
