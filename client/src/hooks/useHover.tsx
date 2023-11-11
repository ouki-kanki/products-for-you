import { useState } from 'react'

interface IUseHover {
  isHovered: boolean,
  activateHover: () => void
  deactivateHover: () => void
}

// TODO maybe do this a general switch to use in other situations?

/**
 * 
 * @param initValue 
 * @returns 
 */
export const useHover = (initValue: boolean = false): IUseHover => {
  const [isHovered, setIsHovered] = useState<boolean>(initValue)

  // const setHover = () => {
  //   setIsHovered((prevState) => !prevState)
  // }

  const activateHover = () => {
    setIsHovered(true)
  }

  const deactivateHover = () => {
    setIsHovered(false)
  }


  return {
    isHovered,
    activateHover,
    deactivateHover
  }
}

