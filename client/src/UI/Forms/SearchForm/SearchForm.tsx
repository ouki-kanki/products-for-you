import { InputHTMLAttributes, forwardRef, FormEvent } from 'react'
import styles from './search.module.scss';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IInput extends InputHTMLAttributes<HTMLInputElement> {

}

type Ref = HTMLInputElement

export const SearchForm = forwardRef<Ref, IInput>(() => {
  const navigate = useNavigate();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form submited")
    // handle the return data with redux & after that navigate

    navigate('/search')
  }

  // TOOD: refactor to use the same method. there is problem with the form event, have to find a solution to dry the code
  const handleSubmit = () => {
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
          type="text" />
        <FontAwesomeIcon
          onClick={handleSubmit}
          className={styles.searchIcon} 
          icon={faSearch} 
          // color=''
          size='1x'/>
      </form>
  )
})
