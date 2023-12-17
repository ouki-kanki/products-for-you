import { useState, ReactNode } from 'react'
import styles from './grid.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTableColumns, faTableCellsLarge, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup } from '../../ButtonGroup/ButtonGroup';


interface Iprops {
  children: ReactNode
}

const buttons = [
  <FontAwesomeIcon icon={faTableList}/>,
  <FontAwesomeIcon icon={faTableCellsLarge}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
]


export const Grid = ({ children }: Iprops) => {
  const [layout, setLayout] = useState('')

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
        <div>3 products found</div>
        <div className={styles.line}></div>
        <div className={styles.sortContainer}>Sort by btn</div>
      </div>

      <div className={`${styles.content} ${styles[layout]}`}>
        {children}
      </div>

    </div>
  )
}
