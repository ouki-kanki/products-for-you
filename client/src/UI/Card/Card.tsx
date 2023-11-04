import React, { PropsWithChildren } from 'react'
import styles from './card.module.scss'


type WidthType = 'medium' | 'wide'

type CardProps = {
  width: WidthType
}



/**
 * 
 * @param param0 
 * @returns 
 * 
 * this have an embedded badding 2rem 1.3rem
 */
export const Card = ({ children, width }: PropsWithChildren<CardProps> ) => {
  const style = (width: WidthType): string => {
    const { medium, wide } = styles
    switch(width) {
      case 'medium':
        return medium
      case 'wide':
        return wide        
    }
  }
  
  return (
    <div 
      className={`${styles.cardContainer} ${style(width)}`}
      >
      {children}
    </div>
  )
}
