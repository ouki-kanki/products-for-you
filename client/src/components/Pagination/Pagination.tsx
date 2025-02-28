import styles from './pagination.module.scss'
import { useClassLister } from '../../hooks/useClassLister'
import { NavLink } from 'react-router-dom'


interface IPaginationProps {
  numberOfPages: number;
  handleNavigate: (page: number) => void;
  prepareLink: (page: number, page_size: number, queryObj: Record<string, string>) => void;
  page: number;
  page_size: number;
  queryObj: Record<string, string>
}

export const Pagination = ({ numberOfPages, handleNavigate, prepareLink, page, page_size, queryObj}: IPaginationProps) => {
  const classes = useClassLister(styles)

  return (
    <div className={styles.paginationContainer}>
      <div
        className={page === 1 ? styles.disabled : ''}
        onClick={() => page > 1 && handleNavigate(page -1)}
        >prev</div>

      {Array.from(Array(numberOfPages).keys()).map((pageNumber, i) => (
        <NavLink
          className={({ isActive }) =>
              isActive && page === pageNumber + 1 ? classes('page', 'isActive') : styles.page
            }
          key={i}
          to={prepareLink(pageNumber + 1, page_size, queryObj
          )}
        >{pageNumber + 1}</NavLink>
      ))}

      <div
      className={page == numberOfPages ? styles.disabled : ''}
      onClick={() => page < numberOfPages && handleNavigate(page + 1)}
      >next</div>
  </div>
  )
}
