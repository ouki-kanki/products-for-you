import { useNavigate } from "react-router-dom";
import { prepareCartItems } from "../../../utils/converters";
import { useCalculateShippingCostsMutation } from "../../../api/paymentApi";
import { showNotification } from "../../../components/Notifications/showNotification";
import type { ICartItem } from "../../../types/cartPayments";
import type { Field } from "../../../hooks/validation/useValidationV2";


export const useCalculateShippingCosts = () => {
  const navigate = useNavigate()
  const [calculateShippingCosts, {data: shippingCostsData, isSuccess: isShippingCostsSuccess, error: shippingCostsError, isError: isShippingCostsError, isLoading: isShippingCostsLoading}] = useCalculateShippingCostsMutation()
  // omit the fields that are not needed

  const calculateShipping = async (items: ICartItem[], validatedFields: Record<string, Field>, recaptchaToken: string) => {
    const filteredItems = prepareCartItems(items)

    try {
      const res = await calculateShippingCosts({
        city: validatedFields.city.value,
        zipCode: validatedFields.zipCode.value,
        recaptchaToken,
        items: filteredItems
      })

      // TODO: fix the type of the shippingCosts
      const {data : { plans }} = res

      navigate('payment')
    } catch (err) {
      if (err.status === 401) {
        showNotification({
          message: 'please login again',
          'type': 'danger'
        })
      }
      showNotification({
        message: 'could not calculate the shipping costs',
        type: 'danger'
      })
    }
  }

  return {
    calculateShipping,
    isShippingCostsSuccess,
    isShippingCostsLoading,
    shippingCostsData,
  }
}
