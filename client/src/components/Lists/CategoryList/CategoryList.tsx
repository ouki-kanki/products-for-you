import { useState } from 'react'
import styles from './categoryList.module.scss'

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

const CategoryItem = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleCategory = () => setIsOpen(prev => !prev)

  return (
    <div
      key={category.id}
      className={styles.categoryContainer}>
        <div
          onClick={toggleCategory}
          className={styles.categoryHeader}>
            {category.name}
            {category.children.length > 0 && <span>toggle</span>}
        </div>
        {isOpen && category.children && (
          <div className={styles.children}>
            {category.children.map(item => (
              <CategoryItem key={item.id} category={item}/>
            ))}
          </div>
        )}
    </div>
  )
}


export const CategoryList = ({ categories }: Category) => {
  return (
    <div className={styles.container}>
      <h2>By category</h2>
      <div className={styles.categoriesContainer}>
        {categories?.map(category => (
          <CategoryItem category={category}/>
        ))}
      </div>
    </div>
  )
}
