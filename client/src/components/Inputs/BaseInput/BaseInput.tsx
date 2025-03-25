import React, { useState, forwardRef } from 'react'
import styles from './baseInput.module.scss'


interface BaseInputProps {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>
  required: boolean;
  errors: string[]
}

const errorList = [
  'field cannot be empty',
  'the sky is blue'
]

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(({ label='username', value, onChange, required=false, errors=errorList }, ref) => {
  const [isFocused, setIsFocused] = useState(false)


  return (
    <div className={styles.container}>
      <label
        className={`${styles.label} ${isFocused || value ? styles.focused : ""}`}
        htmlFor="baseInput"
        >{label} {required && <span className={styles.required}> *required</span>}</label>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          />
        <div className={styles.errorContainer}>
          {errors && errors.map(error => (
            <span className={styles.error}>{error}</span>
          ))}
        </div>
    </div>
  )
})
