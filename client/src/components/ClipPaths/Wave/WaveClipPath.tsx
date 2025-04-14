import { useLocation } from 'react-router-dom'
import styles from './waveClipPath.module.scss'

export const WaveClipPath = () => {
  const location = useLocation()

  return (
    <div className={styles.clipMain}>
    {(location.pathname === '/' || location.pathname === '/login') && (
    <div className={styles.clipContainer}>
      <svg>
        <clipPath id="wave" clipPathUnits="objectBoundingBox">
          <path className="st0" d="M1,0c0,0-0.3,0.1-0.5,0.1S0.3,0,0,0.1V1h1L1,0z"/>
        </clipPath>
      </svg>
    </div>
      )
    }
  </div>
  )
}
