import { SetStateAction, useCallback, useState } from "react";
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
  | null


interface ReturnProps {
  runCaptcha: (action: RecaptchaAction) => Promise<string | null>,
  isBot: boolean;
  setIsBot: React.Dispatch<SetStateAction<boolean>>
}

let recaptchaInstance : Awaited<ReturnType<typeof load>> | null = null
const RECAPTCHA_SITE_KEY: string = import.meta.env.VITE_RECAPTCHA_KEY
/**
 *
 * @param action default is submit, options are login, payment etc
 * @returns an object with the runCaptcha function that returns the token as a promise
 */
export const useRecaptcha = (): ReturnProps => {
  const [isBot, setIsBot] = useState(false)
  const runCaptcha = useCallback(async (action: RecaptchaAction = 'login'): Promise<string | null> => {
    try {
      if (!recaptchaInstance) {
        recaptchaInstance = await load(RECAPTCHA_SITE_KEY)
      }
      const token = await recaptchaInstance.execute(action)
      return token;
    } catch (err) {
      console.error("recaptcha failed ot init", err)
      return null
    }
  }, [])

  return { runCaptcha, isBot, setIsBot }
}
