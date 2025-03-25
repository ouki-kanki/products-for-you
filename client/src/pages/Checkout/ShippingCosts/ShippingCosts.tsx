import { useState, useEffect } from 'react'
import { useOutletContext,useNavigate, useLocation } from "react-router-dom"
import styles from './shippingCosts.module.scss'
import type { ShippingPlan } from '../../../types/cartPayments'

interface ContextProps {
  plans: Array<ShippingPlan>
}

export const ShippingCosts = () => {
  const navigate = useNavigate()
  const { plans, handleShippingPlan } = useOutletContext<ContextProps>()
  const [selectedPlan, setSelectedPlan] = useState<ShippingPlan | null>(null)

  // TODO: can save the plans in local storage and use redux to persist the data on reload
  useEffect(() => {
    if (!plans || plans.length === 0) {
      navigate('/checkout')
    }
  }, [plans, navigate])

  if (!plans || plans?.length === 0) {
    return (
      <div>couldn't find any shippings plans</div>
    )
  }

  const strPlans = JSON.stringify(plans)
  useEffect(() => {
    if (strPlans) {
      const plans = JSON.parse(strPlans)
      setSelectedPlan(plans[0])
    }

  }, [strPlans])

  useEffect(() => {
    handleShippingPlan(selectedPlan)
  }, [selectedPlan, handleShippingPlan])

  const handlePlanChange = (name) => {
    const plan = plans.find(plan => plan.planName === name)
    setSelectedPlan(plan)
  }

  return (
    <div>
      <h3>Available Shipping Plans</h3>
      <div className={styles.planContainer}>
        {plans.map((plan, index) => (
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
    </div>
  )
}
