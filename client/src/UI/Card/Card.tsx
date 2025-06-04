import { PropsWithChildren, HTMLProps } from 'react'
import styles from './card.module.scss'


export type WidthType = 'medium' | 'wide' | 'fluid'

interface ICardProps extends HTMLProps<HTMLDivElement>  {
  width: WidthType;
  image?: string
  shadow?: boolean
}

/**
 *
 * @param param0
 * @returns
 *
 * this have an embedded badding 2rem 1.3rem
 */
export const Card = ({ children, width, image, shadow=true, ...rest }: PropsWithChildren<ICardProps> ) => {
  const style = (width: WidthType): string => {
    const { medium, wide } = styles
    switch(width) {
      case 'medium':
        return medium
      case 'wide':
        return wide
      case 'fluid':
        return ''
    }
  }

  return (
    <div
      className={`${styles.cardContainer} ${style(width)} ${!shadow && styles.noShadow}`}
      { ...rest }
      >
        <div className={styles.imageContainer}>
          {/* __placeholder__for__product_image (white bottom left region) */}
        </div>
      {children}
    </div>
  )
}
