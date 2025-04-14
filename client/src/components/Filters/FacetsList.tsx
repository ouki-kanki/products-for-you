import styles from './facetsList.module.scss'
import { isEmpty } from '../../utils/objUtils'


interface FacetsList {
  facets: Record<string, unknown>;
  handleSelectBoxChange: () => void;
  location: 'sidebar' | 'controlbar'
}


export const FacetsList = ({ facets, handleSelectBoxChange, location='sidebar' }: FacetsList) => {

  return (
    <>
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
    </>
  )
}
