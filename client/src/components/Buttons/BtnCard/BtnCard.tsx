import React from 'react'
import styles from './btnCard.module.scss'

interface BtnCardProps {
  handleClick: () => void;
}

export const BtnCard = ({handleClick}: BtnCardProps) => {
  return (
    <button
      onClick={handleClick}
      className={styles.button}>details</button>
  )
}
