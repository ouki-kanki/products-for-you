import React from 'react'
import styles from './spinner.module.scss'

export const Spinner = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  )
}
