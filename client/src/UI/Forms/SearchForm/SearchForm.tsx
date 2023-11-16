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

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form submited")
    // handle the return data with redux & after that navigate
    setSearchValue('')
    navigate('/search')
  }

  // TOOD: refactor to use the same method. there is problem with the form event, have to find a solution to dry the code
  const handleSubmit = () => {
    setSearchValue('')
    navigate('/search')
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
          onClick={handleSubmit}
          className={styles.searchIcon} 
          icon={faSearch} 
          size='1x'/>
      </form>
  )
})
