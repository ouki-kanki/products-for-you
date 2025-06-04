import { SwiperCarousel } from '../../../components/Carousels/SwiperCarousel'
import styles from './featuredCategories.module.scss';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom'

import { SectionContainer } from '../../../components/Layout/SectionContainer/SectionContainer';

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
    <SectionContainer
      title='Featured Categories'
      linkTitle='more categories'
      linkPath='/categories'>
      {data && data.length > 0 && (
          <div className={styles.carouselContainer}>
            <SwiperCarousel
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
        </div>
      )}
    </SectionContainer>
  )
}
