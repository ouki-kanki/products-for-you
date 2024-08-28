import { useState } from 'react'
import { useSearchParams, useParams } from 'react-router-dom';
import styles from './search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTableColumns, faTableCellsLarge, faTableCells } from '@fortawesome/free-solid-svg-icons';

import { ButtonGroup } from '../../UI/ButtonGroup/ButtonGroup';

const buttons = [
  <FontAwesomeIcon icon={faTableList}/>,
  <FontAwesomeIcon icon={faTableCellsLarge}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
]


export const Search = () => {
  const [layout, setLayout] = useState('')
  const { slug } = useParams()
  // console.log("the searchParams", searchParams.entries())
  console.log(slug)

  const handleChangeLayout = (num: number) => {
      switch(num) {
        case 1:
    console.log("the seach value", searchValue)
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
        <div>3 products found</div>
        <div className={styles.line}></div>
        <div className={styles.sortContainer}>Sort by btn</div>
      </div>

      <div className={`${styles.content} ${styles[layout]}`}>
        <div>item 1</div>
        <div>item 2</div>
        {/* <div className={styles['grid-col-span-2']}>item 2</div> */}
        <div>item 3</div>
        <div>item 4</div>
        <div>item 5</div>
        <div>item 6</div>
        <div>item 7</div>
        <div>item 8</div>
        <div>item 9</div>
      </div>

    </div>
  )
}
