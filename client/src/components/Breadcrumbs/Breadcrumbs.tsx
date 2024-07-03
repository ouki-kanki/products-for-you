import { useLocation, Link } from "react-router-dom"
import styles from './breadCrumbs.module.scss'

export const Breadcrumbs = () => {
  const location = useLocation()

  // console.log(location)
  let currentPath = ''
  // TODO: maybe i do not need to remove %20
  const crumbs = location.pathname.split('/').map(str => str.replace(/%20/g, ' ')).filter(str => str !== '')
    .map(crumb => {
      currentPath += `/${crumb}`

      return (
        <div className={styles.crumb} key={crumb}>
          <Link to={currentPath}>{crumb}</Link>
        </div>
      )
    })


  return (
    <div className={styles.crumbContainer}>
      {crumbs}
    </div>
  )
}
