import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { showNotification } from '../../components/Notifications/showNotification'
import { useLazyResendEmailQuery } from '../../api/authApi'
import { useActivateUserQuery } from '../../api/authApi'
import { jwtDecode } from 'jwt-decode'
import { Spinner } from '../../components/Spinner/Spinner'

interface DecodedToken {
  user_id: string;
}

export const Activation = () => {
  const navigate = useNavigate()
  const [ searchParams ] = useSearchParams()
  const token = searchParams.get("token")

  const [ userId, setUserId ] = useState<string | null>(null)
  const [resendEmail] = useLazyResendEmailQuery()
  const { data: VerificationData, isLoading: verificationLoading, isError: verificationError, isSuccess: verificationSuccess } = useActivateUserQuery(token as string)

  console.log("the user id", userId)

  useEffect(() => {
    if (!token) return;

    const decodedToken = jwtDecode<DecodedToken>(token)
    setUserId(decodedToken.user_id)
  },[token])

  useEffect(() => {
    if (verificationSuccess) {
      showNotification({
        'message': 'account activated'
      })
      navigate('/login')
    }

    if (verificationError) {
      showNotification({
        message: 'could not activate the acount',
        type: 'danger'
      })
    }
  }, [verificationSuccess, verificationError, navigate])

  const handleResendEmail = (userId: string) => {
    if (userId) {
      resendEmail(userId)
    }
  }

  return (
    <div>
      <h1>Activating Account</h1>
      <Spinner/>
      <br />
      <a href="#" onClick={() => handleResendEmail(userId as string)}>resend activation email</a>
    </div>
  )
}
