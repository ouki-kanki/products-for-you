import React, { InputHTMLAttributes, forwardRef } from 'react'
import styles from './search.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IInput extends InputHTMLAttributes<HTMLInputElement> {

}

type Ref = HTMLInputElement

export const Search = forwardRef<Ref, IInput>(() => {
  return (
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          placeholder='Search...'
          type="text" />
        <FontAwesomeIcon
          className={styles.searchIcon} 
          icon={faSearch} 
          // color=''
          size='1x'/>
      </div>
  )
})
