import { useState } from 'react'
import styles from './controlBar.module.scss'
import type { ListResponse, SearchProductItem } from '../../../api/searchApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store/store';
import { isEmpty } from '../../../utils/objUtils';

import { ButtonGroup } from '../../../UI/ButtonGroup/ButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch } from '../../../app/store/store';
import { asyncToggleFacet } from '../../../features/filtering/facetSlice';

interface ControlBarProps {
  handleChangeLayout: (num: number) => void;
  data: ListResponse<SearchProductItem> | undefined;
  sortValue: string
  handleChangeSort: (value: string) => void;
}


export const ControlBar = ({ handleChangeLayout, data, sortValue, handleChangeSort }: ControlBarProps) => {
  const [ isFilterOpen, toggleFilter ] = useState(true)
  const appDispatch = useAppDispatch()
  const { facets } = useSelector((state: RootState) => state.filters)

  // console.log(facets)
  console.log(isFilterOpen)

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
      {/* <button onClick={() => handleAddCategoryFilter('shoes')}>add category</button> */}
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
          onClick={() => toggleFilter((prev) => !prev)}
        />
      </div>
      <div className={`${styles.facetsContainer} ${isFilterOpen ? styles.open : ''}` }>

        {!isEmpty(facets) && Object.keys(facets).map((facet, i) => (
          <div
          className={styles.container}
          key={i}>
          <div className={styles.line}></div>
          <br />
          <h3>By {facet}</h3>
          <div className={styles.facetContainer}>
            {facets[facet].map((item, i) => (
              <div
                key={i}
                className={styles.facetValueContainer}>
                  <div>
                    <input
                      name={item.name}
                      id={item.name}
                      type='checkbox'
                      value={item.isActive}
                      checked={item.isActive}
                      onChange={(e) => handleSelectBoxChange(e, facet)}
                      // name={`${item.name} ${item.count}`}
                      />
                    <label htmlFor={item.name}>{item.name}</label>
                  </div>
                <div>{item.count}</div>
              </div>
            ))}
          </div>
        </div>
        ))}
      </div>

    </div>
  )
}
