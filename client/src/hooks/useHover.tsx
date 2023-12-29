import { useState, useEffect } from 'react'

interface IUseHover {
  isHovered: boolean,
  isTempHovered: boolean
  activateHover: () => void
  deactivateHover: () => void
}

// TODO maybe do this a general switch to use in other situations?

/**
 * 
 * @param initValue 
 * @returns 
 */
export const useHover = (initValue: boolean = false, durationOfTempHover: number = 500): IUseHover => {
  const [isHovered, setIsHovered] = useState<boolean>(initValue)
  const [isTempHovered, setIsTempHovered] = useState<boolean>(false)


  useEffect(() => {
    if (isTempHovered) {
      setTimeout(() => {
        setIsTempHovered(false)
      }, durationOfTempHover)
    }
  }, [isTempHovered, durationOfTempHover])


  const activateHover = () => {
      setIsHovered(true)
      setIsTempHovered(true)
  }

  const deactivateHover = () => {
    setIsHovered(false)
  }


  return {
    isHovered,
    activateHover,
    deactivateHover,
    isTempHovered
  }
}

