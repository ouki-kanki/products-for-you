import styles from './themeBtn.module.scss'
import MoonIcon from '../../../assets/svg_icons/moon.svg?react'
import SunIcon from '../../../assets/svg_icons/sun_v1.svg?react'
import { useTheme } from '../../../context/hooks/useTheme'


export const ThemeBtn = () => {
  const { darkTheme, toggleTheme } = useTheme()
  console.log("isdart", darkTheme)

  return (
    <div
      className={`${styles.container} ${darkTheme ? styles.moon : styles.sun}`}
      onClick={toggleTheme}
      >
      {darkTheme ? (
        <MoonIcon width={20} height={20} fill='beige'/>
      ): (
        <SunIcon
          width={20}
          height={20}
          // stroke='black'
          // strokeWidth={.3}
          fill='yellow'/>
        )
      }
    </div>
  )
}
