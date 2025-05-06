import { useState, useEffect, useRef } from 'react'
import styles from './controlBar.module.scss'
import type { ListResponse, SearchProductItem } from '../../../api/searchApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store/store';

import { ButtonGroup } from '../../../UI/ButtonGroup/ButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { FacetsList } from '../../Filters/FacetsList';

import { useAppDispatch } from '../../../app/store/store';
import { asyncToggleFacet } from '../../../features/filtering/facetSlice';

interface ControlBarProps {
  handleChangeLayout: (num: number) => void;
  data: ListResponse<SearchProductItem> | undefined;
  sortValue: string
  handleChangeSort: (value: string) => void;
}

const animationDuration = 300;

export const ControlBar = ({ handleChangeLayout, data, sortValue, handleChangeSort }: ControlBarProps) => {
  const [ isFilterOpen, setFilterOpen ] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof window.setTimeout>>(null)
  const filterMenuRef = useRef<HTMLDivElement>(null)


  const setHeightValue = () => {
    if (filterMenuRef.current) {
      const menuHeight = filterMenuRef.current.scrollHeight
      document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`)
    }
  }

  // TODO: fix the type of the ref
  const handleToggleFilter = () => {
    if (!isFilterOpen) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsAnimating(true)
      setHeightValue()

    timeoutRef.current = setTimeout(() => {
        setIsAnimating(false)
        setFilterOpen(true)
      }, animationDuration)
      return
    }

    // *** -- this closes the menu -- ***
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsAnimating(true)
    setHeightValue()
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
      setFilterOpen(false)
    }, animationDuration)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const appDispatch = useAppDispatch()
  const { facets } = useSelector((state: RootState) => state.filters)

  const handleSelectBoxChange = (e: React.ChangeEvent<HTMLInputElement>, facetName: string) => {
    appDispatch(asyncToggleFacet({
      facetName,
      propertyName: e.target.name,
      isActive: e.target.checked
    }))
  }

  return (
    <div className={styles.controlBar}>
      <div className={styles.controlButtons}>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            onClick={(num) => handleChangeLayout(num)}
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
        <FontAwesomeIcon
          className={styles.filter}
          icon={faFilter}
          onClick={handleToggleFilter}
        />
      </div>

      <div
        className={`${styles.facetsContainer} ${isFilterOpen ? styles.open : ''} ${isAnimating ? styles.animating : ''}`}
        ref={filterMenuRef}
        >
        <FacetsList
          facets={facets}
          handleSelectBoxChange={handleSelectBoxChange}
          location='controlbar'
        />
      </div>

    </div>
  )
}
