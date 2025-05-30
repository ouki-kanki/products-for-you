import { ReactElement, useState,} from 'react'
import styles from './sidebarField.module.scss';
import { NavLink } from 'react-router-dom';
import type { Facets } from '../../api/searchApi';
import { isEmpty } from '../../utils/objUtils';
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from '../../app/store/store'
import { asyncToggleFacet } from '../../features/filtering/facetSlice'
import { FacetsList } from '../Filters/FacetsList'

interface SidebarFieldProps {
  title: string,
  icon: ReactElement,
  link: string,
  name: string;
  facets: Facets;
}

/**
 *
 *
 * @param {string} title
 * @param {ReactElement} icon - custom styles can be applied to the component inside the className of the provided component.style has to be inside the module scss file of the parent and not to this component!
 * @param {string} link - link for the NavLink component
 *
 * @returns
 */
export const SideBarField = ({ title, icon, link, name, facets }: SidebarFieldProps) => {
  const [isHovered, setIsHovered] = useState<string | null>(null)
  const location = useLocation()
  const rawPath = location.pathname
  const lastElementOfPath = rawPath.slice(-1)
  const appDispatch = useAppDispatch()

  const handleSelectBoxChange = (e: React.ChangeEvent<HTMLInputElement>, facetName: string) => {
    appDispatch(asyncToggleFacet({
      facetName,
      propertyName: e.target.name,
      isActive: e.target.checked
    }))
  }


  // open sidebar nested fields according to the path
  let path = ''
  if (lastElementOfPath === '/') {
    const arr = rawPath.split('/')

    arr.pop()
    path = arr[arr.length - 1]
  } else {
    const arr = rawPath.split('/')
    path = arr[arr.length -1]
  }

  return (
    <div className={styles.navFieldContainer}>
      <NavLink
        to={link}
        className={({isActive}) => (
          `${styles.linkContainer} ${isHovered && styles.hovered} ${isActive ? styles.active : ''}`
        )}
        onMouseEnter={() => setIsHovered('hovered')}
        onMouseLeave={() => setIsHovered(null)}
        >
        <span className={styles.iconContainer}>
          {icon}
        </span>
        <span className={styles.title}>
          {title}
        </span>
      </NavLink>
      {/* TODO: extract to its own component */}
      {path === name.toLowerCase() && title.toLowerCase() === 'products' && (
        <div className={styles.nestedFieldContainer}>
          {!isEmpty(facets) && (
              <FacetsList
                facets={facets}
                handleSelectBoxChange={handleSelectBoxChange}
                location='sidebar'
                />
          )}
        </div>
      )}
    </div>
  )
}
