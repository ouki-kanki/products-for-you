import React, { useState, forwardRef, ReactNode } from 'react'
import styles from './baseInput.module.scss'


interface BaseInputProps {
  label: string;
  value: string;
  name: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  required?: boolean;
  errors?: string[];
}

interface InputProps extends BaseInputProps {
  type: 'input';
  rows?: never;
  cols?: never;
  renderSelect?: never;
}

interface TextAreaProps extends BaseInputProps {
  type: 'text-area';
  rows: number;
  cols: number;
  renderSelect?: never;
}

interface SelectProps extends BaseInputProps {
  type: 'select';
  renderSelect: (name: string) => ReactNode;
  rows: never;
  cols: never;
}

type IInputProps = InputProps | TextAreaProps | SelectProps


export const BaseInput = forwardRef<HTMLInputElement, IInputProps>(({ label='username', value, name, onChange, onBlur, required=false, errors, type='input', rows=5, cols=50, renderSelect }, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur(e)
  }

  return (
    <div className={styles.container}>
      <label
        className={`${styles.label} ${isFocused || value ? styles.focused : ""}`}
        htmlFor={name}
        >{label} {required && <span className={styles.required}> *required</span>}</label>
        {type === 'input' ? (
          <input
            className={styles.input}
            ref={ref}
            type="text"
            value={value}
            name={name}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            />
        ) : type === 'select' ? renderSelect && (
                <div className={styles.input}>
                  {renderSelect(name)}
                </div>
          ): (
          <textarea
            className={styles.textArea}
            rows={rows}
            cols={cols}
            onChange={onChange}
            name={name}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
          />
        )}
        <div className={styles.errorContainer}>
          {errors && errors.map(error => (
            <span key={error} className={styles.error}>{error}</span>
          ))}
        </div>
    </div>
  )
})
