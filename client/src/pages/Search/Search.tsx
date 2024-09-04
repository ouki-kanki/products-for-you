import { useState } from 'react'
import { useSearchParams, NavLink } from 'react-router-dom';
import styles from './search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTableColumns, faTableCellsLarge, faTableCells } from '@fortawesome/free-solid-svg-icons';

import { useSearchProductItemQuery } from '../../api/searchApi';
import { useClassLister } from '../../hooks/useClassLister';
import { usePagination } from '../../hooks/usePagination';
import { useSort } from '../../hooks/useSort';


import { ProductPreview1 } from '../../components/Product/ProductPreviewV1/ProductPreview1';
import { ButtonGroup } from '../../UI/ButtonGroup/ButtonGroup';

const buttons = [
  <FontAwesomeIcon icon={faTableList}/>,
  <FontAwesomeIcon icon={faTableCellsLarge}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
  <FontAwesomeIcon icon={faTableCells}/>,
]

interface PaginationObject {
  search: string
}

// *** --- Main --- ***
export const Search = () => {
  const [layout, setLayout] = useState('')
  const [ searchParams ] = useSearchParams()
  const classes = useClassLister(styles)
  const searchValue = searchParams.get('search') || ''
  const { prepareLink, handleNavigate, page, page_size } = usePagination<PaginationObject>({ search: searchValue })
  const { sortValue, setSortValue } = useSort('time')


  const { data, isError, isFetching, isLoading, isSuccess } = useSearchProductItemQuery({
    query: searchValue,
    page,
    page_size: page_size,
    sort_by: sortValue
  })

  const handleChangeLayout = (num: number) => {
      switch(num) {
        case 1:
          setLayout('')
          break
        case 2:
          setLayout('twoColLayout')
          break
        case 3:
          setLayout('fourColLayout')
          break;
        case 4:
          setLayout('sixColLayout')
      }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.controlBar}>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            onClick={(num) => handleChangeLayout(num)}
            options={buttons}
            width={200}/>
        </div>
        <div>3 products found</div>
        <div className={styles.line}></div>
        <div className={styles.sortContainer}>
          <label htmlFor="sort_by">Sort by</label>
          <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              name="sort_by"
              id="sort_by"
              >
              <option value="time">time</option>
              <option value="time desc">time descenting</option>
              <option value="name">name</option>
              <option value="name desc">name descenting</option>
              <option value="price">price</option>
              <option value="price desc">price descenting</option>
            </select>
        </div>
      </div>

      <div className={`${styles.content} ${styles[layout]}`}>
        {data && data.results.map((product, id) => (
          <ProductPreview1 key={id} { ...product }/>
        ))}
      </div>

      <div className={styles.paginationContainer}>
        <div
          className={page === 1 ? styles.disabled : ''}
          onClick={() => page > 1 && handleNavigate(page -1)}
          >prev</div>

        {data && Array.from(Array(data.num_of_pages).keys()).map((pageNumber, i) => (
          <NavLink
            className={({ isActive }) =>
                isActive && page === pageNumber + 1 ? classes('page', 'isActive') : styles.page
              }
            key={i}
            to={prepareLink(pageNumber + 1, page_size, { search: searchValue }
            )}
          >{pageNumber + 1}</NavLink>
        ))}

        <div
          className={page == data?.num_of_pages ? styles.disabled : ''}
          onClick={() => page < data!.num_of_pages && handleNavigate(page + 1)}
          >next</div>
      </div>
      <div>
        <h2>sort by</h2>
        <div style={{ display: 'flex' }}>

        </div>
      </div>

      <br />


      <div className={styles.sampleContainer}>
            <div className={classes('sample', 'sample_prime')}></div>
            <div className={classes('sample', 'sample_second')}></div>
            <div className={classes('sample', 'sample_active')}></div>
          </div>

      {/* <div className={`${styles.content} ${styles[layout]}`}> */}
        {/* <div>item 2</div> */}
        {/* <div className={styles['grid-col-span-2']}>item 2</div> */}
        {/* <div>item 3</div>
        <div>item 4</div>
        <div>item 5</div>
        <div>item 6</div>
        <div>item 7</div>
        <div>item 8</div>
        <div>item 9</div> */}
      {/* </div> */}

    </div>
  )
}
