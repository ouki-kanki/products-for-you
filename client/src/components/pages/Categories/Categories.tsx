import React from 'react'
import styles from './categories.module.scss'

import { Card } from '../../../UI/Card'

import kdeImage from '../../../assets/kd14_low_res.png';
import demin from '../.././../assets/clothing/demin.png'

import { Category } from './Category/Category';


// TODO: reference these images to pay respect 
// https://unsplash.com/photos/womens-four-assorted-apparel-hanged-on-clothes-rack-WF0LSThlRmw?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash

// Photo by <a href="https://unsplash.com/@alexagorn?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Alexandra Gorn</a> on <a href="https://unsplash.com/photos/womens-four-assorted-apparel-hanged-on-clothes-rack-WF0LSThlRmw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
  

// dummy categories
const categoriesArray = [
  {
    id: 1,
    title: 'Shoes',
    img: kdeImage,
    alt: 'image of a baskeball sneaker'
  },
  {
    id: 2,
    title: 'Jeans',
    img: demin,
    alt: 'jeans image'
  },
  {
    id: 3,
    title: 'Shoes',
    img: kdeImage,
    alt: 'shoe image'
  },
  {
    id: 4,
    title: 'Shoes',
    img: kdeImage,
    alt: 'shoe image'
  },
]



const Categories = () => {

  return (
    <div className={styles.gridContainer}>
      {categoriesArray.map(category => (
        <Category
          key={category.id}
          title={category.title}
          image={category.img}
          alt={category.alt}
          />
      ))}
      <div>child 2</div>
      <div>child 3</div>
      <div>child 4</div>
      <div>child 5</div>
      <div>child 6</div>
      <div>child 7</div>
    </div>
  )
}

export default Categories