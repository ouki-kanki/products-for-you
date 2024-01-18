import styles from './category.module.scss';
import { Card } from '../../../../UI/Card';

import { useHover } from '../../../../hooks/useHover';

interface ICategory {
  id: number
  title: string,
  image: string,
  alt: string
  handleCategoryClick: (id: number) => void 
}


export const Category = ({ id, title, image, alt, handleCategoryClick }: ICategory) => {
  const { activateHover, deactivateHover, isHovered } = useHover()


  return (
    <Card
      onClick={() => handleCategoryClick(id)}
      onMouseEnter={activateHover}
      onMouseLeave={deactivateHover}
      width='fluid'>
      <div 
        className={styles.categoryContainer}
      >
        <div className={`${styles.imageContainer} ${isHovered && styles.isHovered}`}>
          <img src={image} alt={alt}/>
        </div>
        <h2 className={styles.title}>{title}</h2>
      </div>
    </Card>
  )
}
