import { useEffect, useState } from 'react'
import styles from './search.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store/store';
import { addFacets, setActiveFacets } from '../../features/filtering/facetSlice';
import { useNavigate } from 'react-router-dom';

import { isEmpty } from '../../utils/objUtils';
import { useScrollToTop } from '../../hooks/useScrollToTop';

import { useSearchProductItemQuery } from '../../api/searchApi';

import { useSearchParams, useLocation } from 'react-router-dom';
import { useClassLister } from '../../hooks/useClassLister';
import { usePagination } from '../../hooks/usePagination';
import { useSort } from '../../hooks/useSort';
import { useListSearchParams } from '../../utils/routerUtils';
import { usePrevious } from '../../hooks/usePrevious';

import { ProductPreview1 } from '../../components/Product/ProductPreviewV1/ProductPreview1';

import { ControlBar } from '../../components/ControlBars/ControlBar/ControlBar';
import { Spinner } from '../../components/Spinner/Spinner';


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
  const scrollToTop = useScrollToTop()
  const navigate = useNavigate()

  const searchValue = searchParams.get('search') || ''
  const { prepareLink, handleNavigate, page, page_size } = usePagination<PaginationObject>({ search: searchValue })
  const { sortValue, handleChangeSort } = useSort('time')

  // the following hook gathers the querystring from the page (inside the hook) the sort_value and the value from the search form

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

  // ** the flow of data is this: facets are taken from querystring -> send facets with useSearchProductItemQuery -> get the List of facets
  const facets = data?.facets
  const activeFacets = useSelector((state: RootState) => state.filters.activeFacets)

  console.log("the active factes", activeFacets)

  let activeFacetsStr = '';
  if (!isEmpty(activeFacets)) {
    activeFacetsStr = JSON.stringify(activeFacets)
  }

  const prevFacetsStr = usePrevious(activeFacetsStr) as string

  useEffect(() => {
    if (prevFacetsStr === undefined || activeFacetsStr === undefined) {
      return
    }

    if (prevFacetsStr !== activeFacetsStr) {
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

  // ** these are the facets that coming from the server given by the querystring
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
      // where after selecting a facet the back btn on the browser the activeFacets in the redux state did not update\
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
          setLayout('listLayout')
          break
        case 3:
          setLayout('twoColLayout')
          break;
        case 4:
          setLayout('fourColLayout')
      }
  }

  if (isLoading) {
    return <Spinner/>
  }

  // *** navigation ***
  /**
   * scroll to top and navigate
   * @param pageNumber
   * @param page_size
   * @param searchValue
   */
  const handleNavigateToPage = async (pageNumber: number, page_size: number, searchValue: string) => {
    await scrollToTop()
    // navigate(prepareLink(pageNumber + 1, page_size, {search: searchValue}))
    // navigate((pageNumber + 1))
    handleNavigate(pageNumber + 1)
  }

  return (
    <div className={styles.searchContainer}>
      <ControlBar
        sortValue={sortValue}
        data={data}
        handleChangeLayout={handleChangeLayout}
        handleChangeSort={handleChangeSort}
      />

      <div
        className={`${styles.content} ${styles[layout]}`}
        >
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
          <a
            className={page === pageNumber + 1 ? `${styles.page} ${styles.isActive}` : styles.page}
            onClick={() => handleNavigateToPage(pageNumber, page_size, searchValue)}
            key={i}
          >{pageNumber + 1}</a>
        ))}

        <div
          className={page == data?.num_of_pages ? styles.disabled : ''}
          onClick={() => page < data!.num_of_pages && handleNavigate(page + 1)}
          >next</div>
      </div>
      <br />

      {/* TODO: remove -- testing --  */}
      {/* <div className={styles.sampleContainer}>
            <div className={classes('sample', 'sample_prime')}></div>
            <div className={classes('sample', 'sample_second')}></div>
            <div className={classes('sample', 'sample_active')}></div>
      </div> */}
    </div>
  )
}
