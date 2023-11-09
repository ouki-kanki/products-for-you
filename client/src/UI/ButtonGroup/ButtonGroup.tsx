import { useState, ReactNode } from 'react'
import styles from './buttonGroup.module.scss'

/**
 *  onClick(number) - a callback 
 */
interface IButtonGroup {
  options: ReactNode[],
  width?: number,
  onClick?: (num: number) => void
}


// TODO: need to find a way to in the css file to make the container to grow in relation with the children

/**
 * 
 * @param {ReactNode[]} options - array of the btn children 
 * @param onClick(number) - a callback that when clicked it will give the corresponing number of the btn that was clicked so it can be used to provoke some functionality 
 * @returns 
 */
export const ButtonGroup = ({options, width = 250, onClick}: IButtonGroup) => {
  const [selected, setSelected] = useState<number>(1)

  const handleClick = (number: number) => {
    // TODO: this is the typeguard approach.can it solved with a more elegand way?
    onClick && onClick(number);
    setSelected(number)
  }

  const buttonStyles = (number: number): string => (
    `${styles.btn} ${selected === number && styles.active}`
  )
  
  return (
    <div className={styles.container} style={{ width }}>
      {
        options.map((item: ReactNode, index) => (
          <div
            key={index} 
            className={buttonStyles(index + 1)}
            onClick={() => handleClick(index + 1 as number)}
            >{item}</div>
        ))
      }
      {/* <div 
        className={buttonStyles(2)}
        onClick={() => handleClick(2)}
        >second</div>
      <div 
        className={buttonStyles(3)}
        onClick={() => handleClick(3)}
        >third</div> */}
    </div>
  )
}
