import { InputHTMLAttributes, forwardRef, FormEvent, ChangeEvent, useState } from 'react'
import styles from './searchForm.module.scss';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IInput extends InputHTMLAttributes<HTMLInputElement> {

}

type Ref = HTMLInputElement

export const SearchForm = forwardRef<Ref, IInput>(() => {
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate();

  const handleChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value)
  }

  // TODO: fix the typescript bug about the event type 
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (searchValue !== '') {
      setSearchValue('')
      navigate(`/search/${ searchValue }`)
    }
  }

  return (
      <form 
        onSubmit={handleFormSubmit}
        className={styles.inputContainer}
        >
        <input
          className={styles.input}
          placeholder='Search...'
          value={searchValue}
          onChange={handleChange}
          type="text" />
        <FontAwesomeIcon
          onClick={handleFormSubmit}
          className={styles.searchIcon} 
          icon={faSearch} 
          size='1x'/>
      </form>
  )
})
