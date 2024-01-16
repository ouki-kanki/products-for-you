import React from 'react'
import styles from './deliveryTerms.module.scss';

export const DeliveryTerms = () => {
  return (
    <div className={styles.container}>
      <h1>Delivery Terms</h1>

      <div className={styles.section}>
        <p>At Products For You, we believe in providing a seamless and transparent shopping experience, right from your cart to your doorstep. Our delivery terms are designed to ensure fairness, affordability, and the utmost convenience for you.</p>
      </div>
      <div className={styles.section}>
        <h2>Weight-Based Pricing</h2>
        <p>We understand that the weight of your order matters. That's why our pricing is straightforward and directly tied to the weight of the products you choose. You pay only for what you order, ensuring you get the best value for your money.</p>
      </div>

      <div className={styles.section}>
        <h2>Distance Matters, But So Does Affordability</h2>
        <p>While distance does play a role in delivery charges, rest assured that we've structured our pricing to be as fair and affordable as possible. We believe in transparency, and you'll always know exactly how much you're paying for delivery based on your location.</p>
      </div>

      <div className={styles.section}>
        <h2>Bundle and Save</h2>
        <p>Thinking about ordering more? Great choice! We encourage you to bundle your items and save on delivery costs. The more you order, the more you save. It's our way of saying thank you for choosing us for all your shopping needs.</p>
      </div>

      <div className={styles.section}>
        <h2>Fast and Reliable Service</h2>
        <p>We understand the excitement of receiving your order promptly. Our dedicated delivery team works tirelessly to ensure that your products reach you in the shortest possible time, without compromising on safety or quality</p>
      </div>

    </div>
  )
}
