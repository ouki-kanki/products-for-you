import React from 'react'
import styles from './sidebarNested.module.scss'

import { useAppDispatch } from '../../../app/store/store'
import { asyncToggleFacet } from '../../../features/filtering/facetSlice'


export const SidebarNested = ({nestedFields}) => {
  const appDispatch = useAppDispatch()

  const handleSelectBoxChange = (e: React.ChangeEvent<HTMLInputElement>, facetName: string) => {
    appDispatch(asyncToggleFacet({
      facetName,
      propertyName: e.target.name,
      isActive: e.target.checked
    }))

    // dispatch(toggleFacet({
    //   facetName,
    //   propertyName: e.target.name,
    //   isActive: e.target.checked
    // }))
  }

  console.log("the nested fields", nestedFields)

  return (
    Object.keys(nestedFields).map((field, i) => (
      <div
        className={styles.container}
        key={i}>
        <div className={styles.line}></div>
        <br />
        <h3>By {field}</h3>
        <div className={styles.facetContainer}>
          {nestedFields[field].map((item, i) => (
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
                    onChange={(e) => handleSelectBoxChange(e, field)}
                    // name={`${item.name} ${item.count}`}
                    />
                  <label htmlFor={item.name}>{item.name}</label>
                </div>
              <div>{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    )
  ))
}
