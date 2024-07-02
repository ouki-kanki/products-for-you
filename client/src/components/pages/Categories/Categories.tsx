import { useState } from 'react';
import styles from './categories.module.scss'
import { useGetCategoriesQuery } from '../../../api/productsApi';
import { useLazyFilterByCategoryQuery } from '../../../api/productsApi';
import { useNavigate, useParams } from 'react-router-dom';


import { Card } from '../../../UI/Card'

import kdeImage from '../../../assets/kd14_low_res.png';
import demin from '../.././../assets/clothing/demin.png'

import { Category } from './Category/Category';

// TODO: reference these images to pay respect
// https://unsplash.com/photos/womens-four-assorted-apparel-hanged-on-clothes-rack-WF0LSThlRmw?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash

// Photo by <a href="https://unsplash.com/@alexagorn?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Alexandra Gorn</a> on <a href="https://unsplash.com/photos/womens-four-assorted-apparel-hanged-on-clothes-rack-WF0LSThlRmw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>


export type IcategoryRouterState = {
  categoryId: number
}

const Categories = () => {
  const { data: categories , isLoading } = useGetCategoriesQuery()

  const navigate = useNavigate()
  const { slug } = useParams()
  // const [ slug, setSlug ] = useState('')

  const [trigger, result, lastPromiseInfo] =
  useLazyFilterByCategoryQuery()

  const fetchRelatedProducts = (slug: string, id: number) => {
    navigate(`/products/${slug}`, { state: { categoryId:id }})
  }

  // console.log(categories)
  console.log(slug)

  const handleClickCategory = (name: string) => {
    navigate(`/categories/${name}`)
  }

  const renderParentCategories = () => {
    if (categories && categories.length > 0) {
      return categories.filter(category => category.my_parent_category === null).map(category => (
        <li
          className={styles.categoryField}
          key={category.id}
          onClick={() => handleClickCategory(category.name)}
          >{category.name}</li>
      ))
    }

    return 'there are no categories'
  }


  // console.log(renderParentCategories())


  return (
    <div>
      <ul>
        {renderParentCategories()}
      </ul>
      <div className={styles.gridContainer}>
        {categories && categories.map((category, index) => (
          <Category
            id={category.id}
            key={index}
            title={category.name}
            image={category.icon}
            handleCategoryClick={() => fetchRelatedProducts(category.slug, category.id)}
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
