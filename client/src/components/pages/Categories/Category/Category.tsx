import styles from './category.module.scss';
import { Card } from '../../../../UI/Card';

import { useHover } from '../../../../hooks/useHover';

interface ICategory {
  title: string,
  image: string,
  alt: string
}


export const Category = ({ title, image, alt }: ICategory) => {
  const { activateHover, deactivateHover, isHovered } = useHover()

  console.log(isHovered)

  return (
    <Card
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
