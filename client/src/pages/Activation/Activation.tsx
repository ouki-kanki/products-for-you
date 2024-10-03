import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BASE_SOCKET_URL } from '../../api/baseConfig'
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types'
import { showNotification } from '../../components/Notifications/showNotification'
import { useLazyResendEmailQuery } from '../../api/authApi'


export const Activation = () => {
  const navigate = useNavigate()
  const { user_id } = useParams()
  const [trigger] = useLazyResendEmailQuery()


  // effect on success navigate to login
  useEffect(() => {
    let timeoutid: TimeoutId
    const socket = new WebSocket(`${BASE_SOCKET_URL}`)

    socket.onopen = () => {
      console.log("connection established")
    }

    socket.addEventListener("message", (e) => {
      console.log("the message from server", e.data, e.source)
    })

    socket.onmessage = (message) => {
      console.log("the message", message)
      const { data } = message

      if (data === 'user_activated') {

        timeoutid = setTimeout(() => {
          showNotification({
            appearFrom: 'from-bottom',
            duration: 2000,
            hideDirection: 'to-bottom',
            message: 'User activated.You may login',
            position: 'bottom-right'
          })
          navigate('/login')
        }, 1200)
      }
    }

    socket.onclose = () => {
      console.log("connection closed")
    }

    return () => {
      socket.close()
      clearTimeout(timeoutid)
    }
  }, [navigate])

  const handleResendEmail = (uid: string) => {
    if (uid) {
      trigger(uid)
    }
  }

  return (
    <div>
      <h1>Account activation</h1>
      <p>Please use the link in the email that was send to you to activate the account</p>
      <br />
      <a href="#" onClick={() => handleResendEmail(user_id as string)}>resend activation email</a>
    </div>
  )
}
