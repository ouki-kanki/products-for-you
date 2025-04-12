import styles from './themeBtn.module.scss'
import MoonIcon from '../../../assets/svg_icons/moon.svg?react'
import SunIcon from '../../../assets/svg_icons/sun_v1.svg?react'
import { useTheme } from '../../../context/hooks/useTheme'


export const ThemeBtn = () => {
  const { darkTheme, toggleTheme } = useTheme()

  return (
    <div
      className={`${styles.container} ${darkTheme ? styles.sun : styles.moon}`}
      onClick={toggleTheme}
      >
      {darkTheme ? (
        <SunIcon width={20} height={20} fill='yellow'/>
      ): (
        <MoonIcon
          className={styles.moonSvg}
          width={20}
          height={20}
          stroke="none"
          // strokeWidth={.1}
          fill='beige'/>
        )
      }
    </div>
  )
}
