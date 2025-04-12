import { Outlet, Link } from 'react-router-dom'
import { NavBar } from '../components/NavBar/NavBar'
import styles from './home.module.scss'

import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs'
import { Footer } from './Footer/Footer'


const Home = () => {
  return (
    <>
      <NavBar/>
      <Breadcrumbs/>

      <section className={styles.section}>
        <Outlet/>
      </section>
      <Footer/>
    </>
  )
}

export default Home
