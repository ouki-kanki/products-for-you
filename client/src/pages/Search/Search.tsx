import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store/store';
import { addFacets } from '../../features/filtering/facetSlice';

import { isEmpty } from '../../utils/objUtils';

// TODO: create index.ts to export all hooks
import { useSearchProductItemQuery, useLazySearchProductItemQuery } from '../../api/searchApi';
import { useSearchParams, NavLink, json } from 'react-router-dom';
import { useClassLister } from '../../hooks/useClassLister';
import { usePagination } from '../../hooks/usePagination';
import { useSort } from '../../hooks/useSort';
import { useListSearchParams } from '../../utils/routerUtils';


import styles from './search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTableColumns, faTableCellsLarge, faTableCells } from '@fortawesome/free-solid-svg-icons';
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
  const [ searchParams, setSearchParams ] = useSearchParams()
  const classes = useClassLister(styles)
  const dispatch = useDispatch()
  // const [category, setCategory] = useState('shoes')

  // console.log("the search params", searchParams)

  // if the user changes the sort use the hook

  const searchValue = searchParams.get('search') || ''
  const { prepareLink, handleNavigate, page, page_size } = usePagination<PaginationObject>({ search: searchValue })
  const { sortValue, handleChangeSort } = useSort('time')
  // const sortValue = 'time'
  const { paramsStr,  } = useListSearchParams(['sort_by', 'search'])

  console.log("the sort value", sortValue)

  // console.log("the facets srt -> ", paramsStr)

  const { data, isError, isFetching, isLoading, isSuccess, refetch } = useSearchProductItemQuery({
    query: searchValue,
    page,
    // category,
    page_size: page_size,
    sort_by: sortValue || '',
    facets: paramsStr
  })

  // console.log(data)
  useEffect(() => {
    // facets are cached. trigger request when facetslist is changed
    refetch()
  }, [paramsStr, refetch])


  console.log("the data", data)

  const facets = data?.facets
  const activeFacets = useSelector((state: RootState) => state.filters.activeFacets)

  let activeFacetsStr = '';
  if (!isEmpty(activeFacets)) {
    activeFacetsStr = JSON.stringify(activeFacets)
  }

  // set filters to the querystr
  useEffect(() => {
    if (activeFacetsStr.length > 0) {
      const activeFacets = JSON.parse(activeFacetsStr)
      Object.entries(activeFacets).forEach(([ key, value ]) => {
        const valuesstr = value.join(',')

        setSearchParams(searchParams => {
          // if there are no values for the certain facet delete the facet
          if (activeFacets[key].length === 0) {
            searchParams.delete(key)
          } else {
            searchParams.set(key, valuesstr) // append to prev
          }
          return searchParams
        }, { replace: false })

      })
    }
  }, [activeFacetsStr, setSearchParams])

  // TESTING
  const handleAddCategoryFilter = (category: string) => {
    setSearchParams(searchParams => {
      searchParams.set('category', category)
      return searchParams
    })
  }

  let facets_for_dep = ''
  if (!isEmpty(facets)) {
    facets_for_dep = JSON.stringify(facets)
  }

  useEffect(() => {
    if (facets_for_dep.length > 0) {
      const fts = JSON.parse(facets_for_dep)
      dispatch(addFacets({
        facets: fts,
        sideBarFieldName: 'search'
      }))
    }
  }, [facets_for_dep, dispatch])

  // add fitler by category to query string



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
          setLayout('listLayout')
      }
  }

  if (isLoading) {
    // TODO: put a spinner or something
    return <div>Is loading</div>
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.controlBar}>
      {/* <button onClick={() => appDispatch(asyncTest('test'))}>test async</button> */}
        <div className={styles.buttonGroup}>
          <ButtonGroup
            onClick={(num) => handleChangeLayout(num)}
            options={buttons}
            width={200}/>
        </div>
        <div>{ data?.results ? <b>{data.total_items}</b>: 'no' } products found</div>
        <div className={styles.line}></div>
        <div className={styles.sortContainer}>
          <label htmlFor="sort_by">Sort by</label>
          <select
              value={sortValue || ''}
              onChange={(e) => handleChangeSort(e.target.value)}
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

      <button onClick={() => handleAddCategoryFilter('shoes')}>yoyo</button>

      <div className={`${styles.content} ${styles[layout]}`}>
        {data && data.results.map((product, id) => (
          <ProductPreview1
            key={id}
            layout={layout}
            { ...product }/>
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
