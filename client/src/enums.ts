export const enum OrderStatus {
  Placed = 'placed',
  Processing = 'processing',
  Completed = 'completed',
  Canceled = 'canceled',
  Refund = 'refund'
}

// checkout payment
export const enum PaymentIntentStatus {
  SUCCESS = 'succeeded'
}

export const enum CheckoutBtnMode {
  calculateShipping = 'Calculate Shipping',
  proccedToPayment = 'Procced to Payment'
}
