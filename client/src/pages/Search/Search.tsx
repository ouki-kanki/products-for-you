import { useEffect, useState } from 'react'
import styles from './search.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store/store';
import { addFacets, setActiveFacets } from '../../features/filtering/facetSlice';

import { isEmpty } from '../../utils/objUtils';

// TODO: create index.ts to export all hooks
import { useSearchProductItemQuery, useLazySearchProductItemQuery } from '../../api/searchApi';
import { useSearchParams, NavLink, useLocation } from 'react-router-dom';
import { useClassLister } from '../../hooks/useClassLister';
import { usePagination } from '../../hooks/usePagination';
import { useSort } from '../../hooks/useSort';
import { useListSearchParams } from '../../utils/routerUtils';
import { usePrevious } from '../../hooks/usePrevious';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faTableColumns, faTableCellsLarge, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { ProductPreview1 } from '../../components/Product/ProductPreviewV1/ProductPreview1';
import { ButtonGroup } from '../../UI/ButtonGroup/ButtonGroup';
import { Spinner } from '../../components/Spinner/Spinner';

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
  const location = useLocation()

  const searchValue = searchParams.get('search') || ''
  const { prepareLink, handleNavigate, page, page_size } = usePagination<PaginationObject>({ search: searchValue })
  const { sortValue, handleChangeSort } = useSort('time')
  const { paramsStr,  } = useListSearchParams(['sort_by', 'search'])
  const { data, isError, isFetching, isLoading, isSuccess, refetch } = useSearchProductItemQuery({
    query: searchValue,
    page,
    // category,
    page_size: page_size,
    sort_by: sortValue || '',
    facets: paramsStr
  })

  useEffect(() => {
    // facets are cached. trigger request when facetslist is changed
    refetch()
  }, [paramsStr, refetch])

  const facets = data?.facets
  const activeFacets = useSelector((state: RootState) => state.filters.activeFacets)


  let activeFacetsStr = '';
  if (!isEmpty(activeFacets)) {
    activeFacetsStr = JSON.stringify(activeFacets)
  }

  // console.log("activefacets", activeFacets)

  // const prevFacetsStrRef = useRef(activeFacetsStr)
  // let prevFacetsStr = prevFacetsStrRef.current
  const prevFacetsStr = usePrevious(activeFacetsStr) as string

  useEffect(() => {
    // console.log("prev -> ", prevFacetsStr, activeFacetsStr)
    // console.log("current -> ", activeFacetsStr)


    if (activeFacetsStr.length > 0 && prevFacetsStr !== activeFacetsStr) {
      const activeFacets: Record<string, string[]> = JSON.parse(activeFacetsStr)

      setSearchParams((prevSearchParams) => {
        const newSearchParams = new URLSearchParams(prevSearchParams)

        Object.entries(activeFacets).forEach(([key, value]) => {
          if (value.length === 0) {
            newSearchParams.delete(key)
          } else {
            newSearchParams.set(key, value.join(','))
          }
        })
        return newSearchParams
      }, {replace: false})

      // prevFacetsStr = activeFacetsStr
    }
  }, [prevFacetsStr, activeFacetsStr, setSearchParams])

  // TEST the category facet
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
      // TODO: the sidebar also sets the active facets.this was added to fix the problem
      // where after trigger the back btn on the browser the activeFacets in the redux state did not update\
      // timeout here serves to fight the race condition that happens
      // need to find a better approach
      setTimeout(() => {
        dispatch(setActiveFacets())
      }, 300);
    }
  }, [location.search, facets_for_dep, dispatch])

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
    return <Spinner/>
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.controlBar}>
      <button onClick={() => handleAddCategoryFilter('shoes')}>add category</button>
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
