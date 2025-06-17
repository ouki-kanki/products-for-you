import { useState, useEffect, useRef } from 'react'
import styles from './controlBar.module.scss'
import type { ListResponse, SearchProductItem } from '../../../api/searchApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store/store';

import { ButtonGroup } from '../../../UI/ButtonGroup/ButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FacetsList } from '../../Filters/FacetsList';
import { DropDown } from '../../DropDowns/DropDown/DropDown';

import type { SortOption } from '../../../types';

import { useAppDispatch } from '../../../app/store/store';
import { asyncToggleFacet } from '../../../features/filtering/facetSlice';

interface ControlBarProps {
  handleChangeLayout: (num: number) => void;
  data: ListResponse<SearchProductItem> | undefined;
  sortValue: string
  handleChangeSort: (value: string) => void;
  sortData: Array<SortOption>;
}

const animationDuration = 300;

export const ControlBar = ({ handleChangeLayout, data, sortData, sortValue, handleChangeSort }: ControlBarProps) => {
  const [ isFilterOpen, setFilterOpen ] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof window.setTimeout>>(null)
  const filterMenuRef = useRef<HTMLDivElement | null>(null)
  const selectBtnRef = useRef<HTMLSelectElement | null>(null)

  // NOTE: option from select button does not accept dynamic values in css file
  // had to follow this approach
  // TODO: do a research to find if the above is false and there is a way to achieve this
  useEffect(() => {
    if (selectBtnRef) {
      selectBtnRef.current?.querySelectorAll('option')
        .forEach(option => {
          const computedBackgroundColor = getComputedStyle(document.documentElement).getPropertyValue
          ('--primary-color')
          const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color')

          option.style.backgroundColor = computedBackgroundColor
          option.style.color = computedColor
        })
    }
  }, [])

  const setHeightValue = () => {
    if (filterMenuRef.current) {
      // the following is used for the observer to calculate the correct height
      filterMenuRef.current.style.visibility = 'hidden';
      filterMenuRef.current.style.display = 'block';
      const menuHeight = filterMenuRef.current.scrollHeight
      document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`)


      filterMenuRef.current.style.display = '';
      filterMenuRef.current.style.visibility = ''
    }
  }

  // TODO: fix the type of the ref
  const handleToggleFilter = () => {
    if (!isFilterOpen) {
      if (filterMenuRef.current) filterMenuRef.current.scrollLeft = 0;
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsAnimating(true)
      // setHeightValue()

    timeoutRef.current = setTimeout(() => {
        setIsAnimating(false)
        setFilterOpen(true)
      }, animationDuration)
      return
    }

    // *** -- this closes the menu -- ***
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsAnimating(true)
    // setHeightValue()
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
      setFilterOpen(false)
    }, animationDuration)
  }

  useEffect(() => {
    if (!filterMenuRef.current) return;

    const observer = new ResizeObserver(() => {
      setHeightValue();
    })
    observer.observe(filterMenuRef.current)

    return () => {
      observer.disconnect();
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

        {/* <div className={styles.line}></div> */}
        <div className={styles.sortContainer}>
          <DropDown
            label='sort-by'
            defaultValue={sortValue}
            onChange={(value) => handleChangeSort(value)}
            options={sortData}
          />
        </div>
        <FontAwesomeIcon
          className={styles.filter}
          icon={faFilter}
          onClick={handleToggleFilter}
        />
      </div>

      <div>{ data?.results ? <b>{data.total_items}</b>: 'no' } products found</div>

      <div
        className={`${styles.facetsContainer} ${isFilterOpen ? styles.open : ''} ${isAnimating ? styles.animating : ''}`}
        ref={filterMenuRef}>
        <FacetsList
          facets={facets}
          handleSelectBoxChange={handleSelectBoxChange}
          location='controlbar'
        />
      </div>

    </div>
  )
}
