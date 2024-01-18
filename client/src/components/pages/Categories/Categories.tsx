import styles from './categories.module.scss'
import { useGetCategoriesQuery } from '../../../api/productsApi';
import { useLazyFilterByCategoryQuery } from '../../../api/productsApi';

import { Card } from '../../../UI/Card'

import kdeImage from '../../../assets/kd14_low_res.png';
import demin from '../.././../assets/clothing/demin.png'

import { Category } from './Category/Category';

// TODO: press F to pay respect
// TODO: reference these images to pay respect 
// https://unsplash.com/photos/womens-four-assorted-apparel-hanged-on-clothes-rack-WF0LSThlRmw?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash

// Photo by <a href="https://unsplash.com/@alexagorn?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Alexandra Gorn</a> on <a href="https://unsplash.com/photos/womens-four-assorted-apparel-hanged-on-clothes-rack-WF0LSThlRmw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  

const Categories = () => {
  const { data: categories , isLoading } = useGetCategoriesQuery()
  const [trigger, result, lastPromiseInfo] = useLazyFilterByCategoryQuery()
  // console.log(categories)
  // console.log(result, lastPromiseInfo)
  console.log(result.data)


  const fetchRelatedProducts = (id: number) => {
    // console.log(id)
    trigger(id)
  }


  return (
    <div>
      <div className={styles.gridContainer}>
        {categories && categories.map((category, index) => (
          <Category
            id={category.id}
            key={index}
            title={category.name}
            image={category.icon}
            handleCategoryClick={fetchRelatedProducts}
            alt={`${category.name}-image`}
            />
        ))}
        <div>child 2</div>
        <div>child 3</div>
        <div>child 4</div>
        <div>child 5</div>
        <div>child 6</div>
        <div>child 7</div>
      </div>
    </div>
  )
}

export default Categories