import { useState, useEffect, ReactNode } from 'react'
import styles from './buttonGroup.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTableList, faTableCellsLarge, faTableCells, faTableColumns, faTableTennis, faTablet } from '@fortawesome/free-solid-svg-icons';
import { useWindowSize } from '../../hooks/useWindowSize';


/**
 *  onClick(number) - a callback
 */
interface IButtonGroup {
  width?: number,
  onClick?: (num: number) => void
}


/**
 *
 * @param {ReactNode[]} options - array of the btn children
 * @param onClick(number) - a callback that when clicked it will give the corresponing number of the btn that was clicked so it can be used to provoke some functionality
 * @returns
*/
export const ButtonGroup = ({width = 250, onClick}: IButtonGroup) => {
  const [selected, setSelected] = useState<number>(1)
  const [dynamicWidth, setDynamicWidth] = useState(width)
  const windowSize = useWindowSize()

  const buttons = [
  <FontAwesomeIcon icon={faTableColumns}/>,
  <FontAwesomeIcon icon={faTableList}/>,
  <FontAwesomeIcon icon={faTableCellsLarge}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
  ]


  const windowWidth = windowSize[0]
  // show only the fluid and list layout options on mobile
  windowWidth < 667 && buttons.splice(2, 2)

  useEffect(() => {
    windowWidth < 667 ? setDynamicWidth(100) : setDynamicWidth(width)
  }, [windowWidth, width])


  const handleClick = (number: number) => {
    onClick && onClick(number);
    setSelected(number)
  }

  const buttonStyles = (number: number): string => (
    `${styles.btn} ${selected === number && styles.active}`
  )

  return (
    <div className={styles.container} style={{ width: dynamicWidth }}>
      {
        buttons.map((item: ReactNode, index) => (
          <div
            key={index}
            className={buttonStyles(index + 1)}
            onClick={() => handleClick(index + 1 as number)}
            >{item}</div>
        ))
      }
    </div>
  )
}
