import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLazyActivateUserQuery } from '../../api/authApi'


export const ActivationSuccess = () => {
  const { uidb64 } = useParams()
  const [ trigger, { data }] = useLazyActivateUserQuery()


  console.log("the user id", uidb64)

  useEffect(() => {
    if (uidb64) {
      trigger(uidb64)
    }

  }, [uidb64, trigger])

  return (
    <div>ActivationSuccess</div>
  )
}
