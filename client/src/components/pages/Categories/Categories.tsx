import { useState, useEffect } from 'react'
import styles from './categories.module.scss'
import { useGetCategoriesQuery } from '../../../api/productsApi';
import { useLazyFilterByCategoryQuery } from '../../../api/productsApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';


import { ICategory } from '../../../types';

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

// HELPERS
const findParentCategory = (categories: ICategory[] | undefined, name: string) => {
  return categories && categories.find(category => category.name === name )
}

const filterCategoriesWithNoParent = (categories: ICategory[] | undefined) => {
  if (categories && categories.length > 0) {
    return  categories.filter(category => category.my_parent_category === null)
  }
  return []
}

// TODO: export the logic of the router to a seperate component or hook to use it for the breadcrumb?


// MAIN COMPONENT
const Categories = () => {
  const { data: categories , isLoading } = useGetCategoriesQuery()
  const [ currentCategories, setCurrentCategories ] = useState<ICategory[] | undefined>([])
  const { slug } = useParams()

  // console.log("the slug", slug)
  // console.log("the current categories", currentCategories)

  useEffect(() => {
    if (slug) {
      const category = findParentCategory(categories, slug)
      console.log("the category", category)
      setCurrentCategories(category ? category.children : [])
    } else {
      setCurrentCategories(filterCategoriesWithNoParent(categories))
    }

  }, [categories, slug])




  const navigate = useNavigate()
  const [trigger, result, lastPromiseInfo] = useLazyFilterByCategoryQuery()

  const fetchRelatedProducts = (slug: string, id: number) => {
    navigate(`/products/${slug}`, { state: { categoryId:id }})
  }


  const handleClickCategory = (name: string) => {
    const currentCategory = currentCategories && currentCategories.find(cat => cat.name === name)

    if (currentCategory && currentCategory.children.length === 0) {
      fetchRelatedProducts(name, currentCategory.id)
   } else {
    // TODO: if there is no else clause after navigate to products the following navigate triggers . check why this happening.doesn't the component unmounts after navigation ?
     navigate(`${name}`)
   }

  }



  return (
    <div>
      <div className={styles.gridContainer}>
        {currentCategories && currentCategories.map(category => (
          <Category
            id={category.id}
            key={category.id}
            title={category.name}
            image={category.icon}
            handleCategoryClick={() => handleClickCategory(category.name)}
            alt={`${category.name}-image`}
            />
          // <li
          //   className={styles.categoryField}
          //   key={category.id}
          //   onClick={() => handleClickCategory(category.name)}
          // >
          //   {category.name}
          // </li>
        ))}
      </div>

      {/* <div className={styles.gridContainer}>
        <div>child 2</div>
        <div>child 3</div>
        <div>child 4</div>
        <div>child 5</div>
        <div>child 6</div>
        <div>child 7</div>
      </div> */}

      <Routes>
        <Route path="/:slug/*" element={<Categories />}/>
      </Routes>
    </div>
  )
}

export default Categories
