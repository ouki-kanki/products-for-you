import { useState } from 'react'
import styles from './buttonGroup.module.scss'


interface IButtonGroup {

}

type ISelection = 1 | 2 | 3 

export const ButtonGroup = () => {
  const [selected, setSelected] = useState<ISelection>(1)

  const handleClick = (number: ISelection) => {
    setSelected(number)
  }

  const buttonStyles = (number: number): string => (
    `${styles.btn} ${selected === number && styles.active}`
  )
  
  return (
    <div className={styles.container}>
      <div 
        className={buttonStyles(1)}
        onClick={() => handleClick(1)}
        >first</div>
      <div 
        className={buttonStyles(2)}
        onClick={() => handleClick(2)}
        >second</div>
      <div 
        className={buttonStyles(3)}
        onClick={() => handleClick(3)}
        >third</div>
    </div>
  )
}
