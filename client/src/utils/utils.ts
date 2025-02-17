export function assertCannotReach(x: never) {
  throw new Error(`some case is missing, value ${x} has type of never`)
}

/**
 *
 * @param price
 * @returns if price is int it removes the decimal points
 */
export const formatPrice = (price: string) => {
  const numPrice = parseFloat(price)
  return numPrice % 1 === 0 ? numPrice.toFixed(0) : price
}
