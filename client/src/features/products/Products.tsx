import { useState, useEffect } from 'react'
import styles from './products.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTableColumns, faTableCellsLarge, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup } from '../../UI/ButtonGroup/ButtonGroup';
import { useLocation } from 'react-router-dom';
import { useFilterByCategoryQuery, useLazyFilterByCategoryQuery } from '../../api/productsApi';

import { ProductCardV3 } from '../../components/Product/ProductCardV3';

const buttons = [
  <FontAwesomeIcon icon={faTableList}/>,
  <FontAwesomeIcon icon={faTableCellsLarge}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
]


export const Products = () => {
  const [layout, setLayout] = useState('')
  const location = useLocation()
  const categoryId = location.state?.categoryId
  const [trigger, result, lastPromiseInfo] = useLazyFilterByCategoryQuery()
  
  // use the latest_products_query
  // use query paramater and if there is query parameter take the parameter and filter with the parameter 
  // when the user redirects from the categories asing the value from the router state to a variable named category_id and use this to apply a filter 

  useEffect(() => {
    trigger(categoryId)
  }, [categoryId, trigger])

  // console.log("the result from /lazy", result)
  const data = result?.data

  console.log("the data", data)
 
  const handleChangeLayout = (num: number) => {
      switch(num) {
        case 1:
          setLayout('')
          break
        case 2:
          setLayout('twoColLayout')
          break
        case 3:
          setLayout('fourColLayout')
          break; 
        case 4:
          setLayout('sixColLayout')
      }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.controlBar}>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            onClick={(num) => handleChangeLayout(num)}
            options={buttons} 
            width={200}/>
        </div>
        <div>{data && data.length} products found</div>
        <div className={styles.line}></div>
        <div className={styles.sortContainer}>Sort by btn</div>
      </div>

      <div className={`${styles.content} ${styles[layout]}`}>
        {data && data.map((product, index) => (
          <ProductCardV3
             
            key={index}/>
        ))}
        <div className={styles.productItem}>item 1</div>
        <div className={styles.productItem}>item 2</div>
        {/* <div className={styles['grid-col-span-2']}>item 2</div> */}
        <div className={styles.productItem}>item 3</div>
        <div className={styles.productItem}>item 4</div>
        <div className={styles.productItem}>item 5</div>
        <div className={styles.productItem}>item 6</div>
        <div className={styles.productItem}>item 7</div>
        <div className={styles.productItem}>item 8</div>
        <div className={styles.productItem}>item 9</div>
      </div>

    </div>
  )
}
