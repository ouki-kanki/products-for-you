import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

import styles from './inputWithPassword.module.scss'

import { Input } from '../'

interface inputProps {
  name: string
}


export const InputWithPassword = ({ name }: inputProps) => {
  return (
    <div className={styles.inputContainer}>
      <Input hasLabel label='yoyo'/>
    </div>
  )
}

