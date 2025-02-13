import { useState, useEffect } from 'react'
import styles from './categories.module.scss'
import { useGetCategoriesQuery } from '../../api/productsApi';
import { useLazyFilterByCategoryQuery } from '../../api/productsApi';
import { useNavigate, useParams, createSearchParams } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';


import { ICategory } from '../../types';

import { Card } from '../../UI/Card'

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


// MAIN COMPONENT
const Categories = () => {
  // console.log("categories component mounted")
  const { data: categories , isLoading } = useGetCategoriesQuery()
  const [ currentCategories, setCurrentCategories ] = useState<ICategory[] | undefined>([])
  const { slug } = useParams()

  useEffect(() => {
    if (slug) {
      const category = findParentCategory(categories, slug)
      setCurrentCategories(category ? category.children : [])
    } else {
      setCurrentCategories(filterCategoriesWithNoParent(categories))
    }

  }, [categories, slug])


  // console.log("categories", categories)

  const navigate = useNavigate()
  const [trigger, result, lastPromiseInfo] = useLazyFilterByCategoryQuery()


  const fetchRelatedProducts = (slug: string, categorySlug:string) => {

    // NOTE: state is not used because products route has to not be depended on the router state. if someone paste the url from somewhere the url has to give the result.
    navigate(`/products/${slug}`, { state: { categorySlug:categorySlug }})
  }

  const handleClickCategory = (slug: string) => {
    const currentCategory = currentCategories && currentCategories.find(cat => cat.slug === slug)
    console.log('currentcat', currentCategory, slug)

    // if there no more chilren fetch the related items
    if (currentCategory && currentCategory.children.length === 0) {
      console.log("current category slu", currentCategory.id)
      console.log("the slug of category", slug)
      // fetchRelatedProducts(slug, currentCategory.id)
      navigate({
        // to: '/search',
        pathname: '/search',
        search: createSearchParams({
          category: slug
        }).toString()
      })
   } else {
    // this is used when there are children categories to jump to the child
     navigate(`${slug}`)
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
