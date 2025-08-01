import styles from './activationPending.module.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyResendEmailQuery } from '../../api/authApi';
import { showNotification } from '../../components/Notifications/showNotification';
import type { IServerErrorV2 } from '../../types';

export const ActivationPending = () => {
  const [resendEmail, { isLoading }] = useLazyResendEmailQuery()
  const { uid  }  = useParams<{ uid: string }>()
  const [ coolDown, setCoolDown ] = useState(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (coolDown > 0) {
      timer = setTimeout(() => {
        setCoolDown(prev => prev -1)
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [coolDown])

  const handleResendEmail = async (uid: string) => {
    try {
      await resendEmail(uid).unwrap()
      if (coolDown === 0) {
        setCoolDown(30)
      }

      showNotification({
        message: 'email has been send. please check your email'
      })
    } catch (error: unknown) {
      const serverError = error as IServerErrorV2

        if (serverError.status === 429) {
          showNotification({
            message: 'request has been throttled',
            type: 'danger'
          })
        }
    }
  }

  return (
    <div className={styles.container}>
      <h1>Activatiion Pending</h1>
      <h3>an email has been send</h3>
      <a onClick={() => handleResendEmail(uid as string)}>resend email</a>
      {coolDown > 0 && <p>please wait {coolDown} second before resending the email</p>}
    </div>
  )
}
