import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import styles from './favoritesBtn.module.scss'
import { useHover } from '../../../hooks/useHover'

interface IFavoritesBtnProps {
  handleFavorite: (slug: string) => void;
  isFavorite: boolean;
}

export const FavoritesBtn = ({ handleFavorite, isFavorite }: IFavoritesBtnProps) => {
  const { activateHover, deactivateHover, isTempHovered } = useHover(undefined, 300)
  return (
    <FontAwesomeIcon
    onMouseEnter={activateHover}
    onMouseLeave={deactivateHover}
    onClick={handleFavorite}
    className={`${styles.heartIcon} ${isTempHovered && styles.heartIconScale}`}
    icon={isFavorite ? faHeartSolid : faHeart}
    size='2x'/>
  )
}
