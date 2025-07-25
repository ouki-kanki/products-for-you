import { useState } from 'react'
import styles from './products.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList,faTableCellsLarge, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup } from '../../UI/ButtonGroup/ButtonGroup';
import { useLocation, useParams } from 'react-router-dom';

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
  const categorySlug = location.state?.categorySlug
  const { slug } = useParams()

  const data = result?.data

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
