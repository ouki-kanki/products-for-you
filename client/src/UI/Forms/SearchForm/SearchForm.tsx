import { InputHTMLAttributes,
         forwardRef,
         FormEvent,
         ChangeEvent,
         useContext,
         useEffect,
         useState } from 'react'
import styles from './searchForm.module.scss';
import { useNavigate } from 'react-router-dom';


import { useLazySugestProductNameQuery } from '../../../api/searchApi';
import { useDebouncedValue } from '../../../hooks/useDebounce';
import { SettingsContext } from '../../../context/SettingsContext';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// TODO: type this correctly
interface IInput extends InputHTMLAttributes<HTMLInputElement> {

}
type Ref = HTMLInputElement

export const SearchForm = forwardRef<Ref, IInput>(() => {
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate();
  const { defaultPageSize } = useContext(SettingsContext)

  const handleChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value)
  }

  const debouncedSearchValue = useDebouncedValue(searchValue, 500)
  const [ trigger, { data: suggeStionData, isUninitialized }] = useLazySugestProductNameQuery()

  useEffect(() => {
    if (debouncedSearchValue !== '') {
      trigger(debouncedSearchValue)
    }
  }, [debouncedSearchValue, trigger, isUninitialized])

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue !== '') {
      setSearchValue('')
      navigate(`/search/?search=${ searchValue }&page_size=${defaultPageSize}`)
    }
  }


  // console.log("the data", suggeStionData)

  return (
      <form
        onSubmit={handleFormSubmit}
        className={styles.inputContainer}
        >

        {/* <div className={styles.datalist}>yoyo</div> */}

        <input
          className={styles.input}
          placeholder='Search...'
          value={searchValue}
          list='data'
          onChange={handleChange}
          type="text" />
          <datalist
            className={styles.datalist}
            id='data'
            >
            {debouncedSearchValue.length > 0 &&
              suggeStionData?.map((item, index) => (
              <option key={index} value={item}/>
            ))
          }
        </datalist>
        <FontAwesomeIcon
          onClick={handleFormSubmit}
          className={styles.searchIcon}
          icon={faSearch}
          size='1x'/>
      </form>
  )
})
