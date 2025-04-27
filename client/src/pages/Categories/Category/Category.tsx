import styles from './category.module.scss';
import { Card } from '../../../UI/Card';

import { useHover } from '../../../hooks/useHover';



export interface CategoryCard {
  id: number
  title: string,
  image: string,
  alt: string
  handleCategoryClick: (id: number) => void
}


export const Category = ({ id, title, image, alt, handleCategoryClick }: CategoryCard) => {
  const { activateHover, deactivateHover, isHovered } = useHover()


  return (
    <div
      onClick={() => handleCategoryClick(id)}
      onMouseEnter={activateHover}
      onMouseLeave={deactivateHover}
      className={styles.categoryContainer}
      // width='fluid'
      >
        <div className={`${styles.imageContainer} ${isHovered && styles.isHovered}`}>
          <img src={image} alt={alt}/>
        </div>
        <h2 className={styles.title}>{title}</h2>
    </div>
  )
}
