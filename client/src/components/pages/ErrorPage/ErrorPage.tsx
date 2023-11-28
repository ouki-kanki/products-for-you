import styles from './errorPage.module.scss'

export const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <h1>Page not found</h1>
      <div className={styles.four}>404</div>
    </div>
  )
}
