import { useState, useEffect } from 'react'
import styles from './animatedCross.module.scss'
import { useClassLister } from '../../../hooks/useClassLister';

interface IAnimatedCrossProps {
  onClick: () => void;
  isHidden: boolean;
}

export const AnimatedCross = ({onClick, isHidden}: IAnimatedCrossProps) => {
  const [rotation, setRotation] = useState('')
  const classes = useClassLister(styles)

  useEffect(() => {
    if (isHidden) {
      setRotation('plus')
    }
  }, [isHidden])

  const handleRotate = () => {
    onClick()
    // this prevent the initial animation
    // when component load do not animate the + symbol
    // rotation will be an empty string
    setRotation((rotation) => {
      if (!rotation) {
        return 'minus'
      } else if (rotation === 'minus') {
        return 'plus'
      } else {
        return 'minus'
      }
    })
  }

  return (
    <div
      onClick={handleRotate}
      className={styles.hitbox}
      >
      <div
        className={classes('symbol', `${rotation}`)}
        ></div>
    </div>
  )
}
