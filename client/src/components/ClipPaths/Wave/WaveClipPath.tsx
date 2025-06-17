import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './waveClipPath.module.scss'

export const WaveClipPath = () => {
  const location = useLocation()
  // console.log("location", location.pathname)

  const [direction, setDirection] = useState("M1,0c0,0-0.3,0.1-0.5,0.1S0.3,0,0,0.1V1h1L1,0z"); // Default clip-path

  useEffect(() => {
    const updateClipPath = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setDirection("M1,0c 0.7, -0.1 -0.3,0.3 0.3, 0.3 S0.1,0,0,0.1V1h1L1,0z");
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setDirection("M1,0c0,0-0.4,0.15-0.6,0.15S0.2,0,0,0.12V1h1L1,0z");
      } else {
        setDirection("M1,0 c 0,1 0.1,0.2 0.5,0.2 S0.3,0,0,0.1V1h1L1,0z");
      }
    };

    updateClipPath();
    window.addEventListener("resize", updateClipPath);
    return () => window.removeEventListener("resize", updateClipPath);
  }, []);

  return (
    <div className={styles.clipMain}>
      {(location.pathname === '/' || location.pathname === '/login_obs') && (
      <div className={styles.clipContainer}>

        <svg className={styles.clip}>
          <clipPath id="wave" clipPathUnits="objectBoundingBox">
            {/* <path className="st0" d="M1,0c0,0-0.3,0.1-0.5,0.1S0.3,0,0,0.1V1h1L1,0z"/> */}
            <path className="st0" d={direction}/>
          </clipPath>
        </svg>
      </div>
        )
      }
    {(location.pathname !== '/checkout/payment') && (
      <div className={styles.imageContainer}>
        <img
          className={styles.imageOne}
          src='/public/images/sneaker_pink.png'></img>
      </div>
    )}
  </div>
  )
}
