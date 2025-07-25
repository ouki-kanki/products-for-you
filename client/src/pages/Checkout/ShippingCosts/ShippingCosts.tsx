import { useState, useEffect } from 'react'
import { useOutletContext,useNavigate, useLocation } from "react-router-dom"
import styles from './shippingCosts.module.scss'
import type { ShippingPlan } from '../../../types/cartPayments'

interface ContextProps {
  plans: Array<ShippingPlan>
}

const enum Plans  {
  PICKUP_FROM_STORE = 'pickup from store'
}

// TODO: its not clear that the
export const ShippingCosts = () => {
  const navigate = useNavigate()
  const { plans, handleShippingPlan } = useOutletContext<ContextProps>()
  const [selectedPlan, setSelectedPlan] = useState<ShippingPlan | null>(null)

  useEffect(() => {
    if (!plans || plans.length === 0) {
      navigate('/checkout')
    }
  }, [plans, navigate])

  const strPlans = plans && plans.length> 0 ? JSON.stringify(plans) : null
  useEffect(() => {
    if (strPlans) {
      const plans = JSON.parse(strPlans)
      setSelectedPlan(plans[0])
    }

  }, [strPlans])

  useEffect(() => {
    handleShippingPlan(selectedPlan)
  }, [selectedPlan, handleShippingPlan])

  const handlePlanChange = (name: string) => {
    if (name === Plans.PICKUP_FROM_STORE) {
      const pickupPlan = plans.find(plan => plan.planName === Plans.PICKUP_FROM_STORE)
      setSelectedPlan(pickupPlan)

    } else {
      const plan = plans?.find(plan => plan.planName === name)
      setSelectedPlan(plan)
    }
  }

  const renderPickupPlan = (plans) => {
    const pickupPlan = plans?.find(plan => plan.planName === Plans.PICKUP_FROM_STORE)
    if (!pickupPlan) {
      return
    }

    return (
      <>
        <h3 className={styles.otherOptionsTitle}>Other options</h3>
        <div className={styles.planContainer}>
          <div className={styles.row}>
            <div className={styles.value}>{pickupPlan.planName}</div>
            <div className={styles.value}></div>
            <div className={styles.value}></div>
            <div className={styles.value}>{pickupPlan.cost}</div>
            <input
              id='plan_radio'
              type='radio'
              checked={selectedPlan?.planName === Plans.PICKUP_FROM_STORE}
              onChange={() => handlePlanChange(Plans.PICKUP_FROM_STORE)}
              />
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <h3>Available Shipping Plans</h3>
      <div className={styles.planContainer}>
        {plans?.filter(plan => plan.planName !== Plans.PICKUP_FROM_STORE).map((plan, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.value}>{plan.companyName}</div>
            <div className={styles.value}>{plan.planName}</div>
            <div className={styles.value}>{plan.estimatedDeliveryTime}</div>
            <div className={styles.value}>${plan.cost}</div>
            <input
              type='radio'
              checked={selectedPlan?.planName === plan.planName}
              onChange={() => handlePlanChange(plan.planName)}
              />
          </div>
        ))}
      </div>
      {renderPickupPlan(plans)}
    </div>
  )
}
