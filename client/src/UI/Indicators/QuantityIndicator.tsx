import styles from './quantityIndicator.module.scss'
import { useClassLister } from '../../hooks/useClassLister'


const enum Availability {
  available = 'available',
  limited = 'limited quantity',
  not_available = 'not available'
}

const mapAvailabilitytoClasses = {
  [Availability.available]: 'available',
  [Availability.limited]: 'caution',
  [Availability.not_available]: 'danger'
}

interface QuantityIndicatorProps {
  // quantity?: number;
  availability: string;
}

export const QuantityIndicator = ({availability }: QuantityIndicatorProps) => {
    const classes = useClassLister(styles)
    if (availability) {

      const availabilityClass: string = mapAvailabilitytoClasses[availability]

      return (
        <div className={styles.containerIndicator}>
          <div className={classes('label', `${availabilityClass}`)}>{availability}</div>
          <div className={classes('indicator')}></div>
        </div>
      )
    }
    return <div></div>
}

