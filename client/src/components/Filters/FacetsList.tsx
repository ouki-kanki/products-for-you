import { useState } from 'react'
import styles from './facetsList.module.scss'
import { isEmpty } from '../../utils/objUtils'


interface FacetsListProps {
  facets: Record<string, unknown>;
  handleSelectBoxChange: (e: React.ChangeEvent<HTMLInputElement>, facet: string) => void;
  location: 'sidebar' | 'controlbar'
}

export const FacetsList = ({ facets, handleSelectBoxChange, location='sidebar' }: FacetsListProps) => {

  return (
    <div className={`${styles.facetsContainer} ${styles[`${location}`]}` }>
      {!isEmpty(facets) && Object.keys(facets).map((facet, i) => (
        <div
        className={`${styles.container}`}
        key={i}>
        <div className={styles.line}></div>
        <br />
        <div className={styles.column}>
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
      </div>
      ))}
    </div>
  )
}
