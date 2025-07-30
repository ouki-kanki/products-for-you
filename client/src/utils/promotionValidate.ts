import type { Promotion } from "../api/types"

// TODO: server supports more that one promotion in the array .
// for now i handle only the first promotion
/**
 * return the promotion instance if the promotion is active
 * @param promotions
 */
export const getPromotion = (promotions: Array<Promotion>) => {
  const promotion: Promotion | null = promotions.length > 0 ? promotions[0] : null
  // console.log("inside promo val", promotion)
  if (promotion && promotion.is_active) {
    return promotion
  }
  return null
}
