import styles from './activationPending.module.scss';
import { useParams } from 'react-router-dom';

export const ActivationPending = () => {
  const { uid  }  = useParams<{ uid: string }>()
  console.log("the uid ", uid)

  return (
    <div>
      <h1>Activatiion Pending</h1>
      <h3>an email has been send</h3>
      <p>resend email</p>
    </div>
  )
}
