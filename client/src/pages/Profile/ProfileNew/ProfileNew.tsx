import { useReducer, ChangeEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import styles from './profileNew.module.scss'
import { Input } from '../../../UI/Forms/Inputs'
import { userProfileFields } from '../userProfileFields'
import { fieldsReducer } from '../../../app/reducers';
import { showNotification } from '../../../components/Notifications/showNotification';

import { useCreateUserProfileMutation } from '../../../api/userProfileApi'

import { convertCamelToSnake } from '../../../utils/converters';

interface ProfileState {
  firstName: string;
  lastName: string;
  addressOne: string;
  addressTwo: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  city: string;
  country: string;
  image: File | null;
  [key: string]: string | File | null
}

const initialState: ProfileState = {
  firstName: '',
  lastName: '',
  addressOne: '',
  addressTwo: '',
  phoneNumber: '',
  cellPhoneNumber: '',
  city: '',
  country: '',
  image: null
}

export const ProfileNew = () => {
  const [state, dispatch] = useReducer(fieldsReducer<ProfileState>, initialState)
  const navigate = useNavigate()

  const [submit, {data: insertData, isError: isInsertError, isLoading: isInsertLoading, isSuccess: isInsertSuccess, error: insertError}] = useCreateUserProfileMutation()

  const handleChange = ({ target: { value, name, files }}: ChangeEvent<HTMLInputElement>) => {
    if (name === 'image' && files) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        dispatch({ type: 'CHANGE', name, value: file })
        return
      } else {
        // TODO: give info about the correct allowed res
        showNotification({
          message: 'please use an image type file',
          type: 'danger'
        })
        return
      }
    }
    dispatch({ type: 'CHANGE', name, value })
  }

    // TODO: useValidation
    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault()
      const fieldsData = { ...state } // not needed

      const convertedData = convertCamelToSnake({ data: fieldsData })

      const formData = Object.entries(convertedData).reduce((formData, [key, value]) => {
        // convert to snake with the util file
          if (value || value === '') {
            formData.append(key, value)
            return formData
          }
          return formData
      }, new FormData())


      const data = await submit(formData).unwrap().catch(err => {
        console.log("the error", err)
        // TODO: show notification
      })

      // window.location.reload()
      navigate('/profile')
    }

  // TODO: this is not running
  if (isInsertSuccess) {
    console.log("inside the navigate")
    return (
      <Navigate to='../'/>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>New User Profile</h1>
      {userProfileFields.map(field => {
        // 2 way binding with File has to be handle with a different manner
        // TODO: add 2 way binding to File
        if (field.name === 'image') {
        return (
          <div
            key={field.id}
            className={styles.inputContainer}>
            <label htmlFor={field.name}>{field.label}</label>
            <Input
              id={field.id}
              name={field.name}
              onChange={handleChange}
              type={field.type} />
          </div>
        )
        } else {
          return (
          <div
            key={field.id}
            className={styles.inputContainer}>
            <label htmlFor={field.name}>{field.label}</label>
            <Input
              id={field.id}
              name={field.name}
              value={state[field.name as string ]}
              onChange={handleChange}
              type={field.type} />
          </div>
          )
        }
      })}
      <button
        className={styles.insertBtn}
        type='submit'>insert</button>
    </form>
  )
}
