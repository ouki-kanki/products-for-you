import styles from './quantityIndicator.module.scss'
import { useClassLister } from '../../hooks/useClassLister'


const enum Availability {
  available = 'available',
  limited = 'limited number of items',
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

      console.log(availability)
      const availabilityClass: string = mapAvailabilitytoClasses[availability]

      return (
        <div className={classes('label', `${availabilityClass}`)}>{availability}</div>
      )
    }
    return <div></div>


    // if (availability) {
    //   switch(true) {
    //     case availability === Availability.not_available:
    //       return <div className={classes('label', 'danger')}>{availability}</div>
    //     case availability === Availability.limited:
    //       return <div className={classes('label', 'caution')}>limited number of items left</div>
    //     case availability >= 4:
    //       return <div className={classes('label', 'available')}>available</div>
    //   }
    // } else {
    //   return <div className={classes('label', 'danger')}>quantity not available. contanct store</div>
    // }
}

