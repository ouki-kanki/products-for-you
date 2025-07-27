import { useCallback } from "react";
import { load } from "recaptcha-v3";

type RecaptchaAction =
  | 'login'
  | 'signup'
  | 'password_reset'
  | 'cart_add'
  | 'cart_view'
  | 'payment_add'
  | 'checkout'
  | 'transaction_confirmed'
  | 'get_price'


const RECAPTCHA_SITE_KEY: string = import.meta.env.VITE_RECAPTCHA_KEY
/**
 *
 * @param action default is submit, options are login, payment etc
 * @returns an object with the runCaptcha function that returns the token as a promise
 */
export const useRecaptcha = (): {runCaptcha: (action: RecaptchaAction) => Promise<string | null>} => {
  const runCaptcha = useCallback(async (action: RecaptchaAction = 'login'): Promise<string | null> => {
    try {
      const recaptcha = await load(RECAPTCHA_SITE_KEY)
      const token = await recaptcha.execute(action)
      return token;
    } catch (err) {
      console.error("recaptcha failed ot init", err)
      return null
    }
  }, [])

  return { runCaptcha }
}
