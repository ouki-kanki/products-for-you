import React from 'react'
import styles from './categories.module.scss'

import { Card } from '../../../UI/Card'


const Categories = () => {

  return (
    <div className={styles.gridContainer}>
      <Card width='fluid'>
        <div>child 1</div>
        <h2>Shoes</h2>
      </Card>
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