import styles from './errorPage.module.scss'
import { Link } from 'react-router-dom'

export const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <h1>Page not found</h1>
      <div className={styles.four}>404</div>
      <Link to='/'>return to Home</Link>
    </div>
  )
}
