import { useReducer, ChangeEvent, Reducer, useEffect } from 'react'
import type {
  IValidationAction,
  IGetTracker,
  IValidationState
 } from './validationTypes'

import { ActionTypes } from './validationTypes';
import { getTracker, getPasswordStrength } from './helpers';

const  validationReducer: Reducer<IValidationState, IValidationAction> = (state , action): IValidationState => {
  // TODO if i destructure payload it throws errors when used inside the reducer 
  const { type } = action
  switch (type) {
    case ActionTypes.SET_EMAIL:
      return { ...state, email: action.payload, emailError: ''}
    case ActionTypes.SET_EMAIL_ERROR:
      return { ...state, emailError: action.payload }
    case ActionTypes.SET_PASSWORD:
      return { ...state, password: action.payload, passwordError: ''}
    case ActionTypes.SET_PASSWORD_ERROR:
      return { ...state, passwordError: action.payload }
    case ActionTypes.SET_PASSWORD_STRENGTH:
      return { ...state, passwordStrength: action.payload }
    case ActionTypes.SET_IS_TOUCHED:
      return { ...state, isTouched: true }
    case ActionTypes.SET_EMAIL_IS_VALID:
      return { ...state, isEmailValid: action.payload }
    case ActionTypes.SET_PASSWORD_IS_VALID:
      return { ...state, isPasswordValid: action.payload }
    case ActionTypes.SET_IS_VALID:
      return { ...state, isValid: action.payload }
    default:
      return state
  }
}

const initialState: IValidationState = {
  email: '',
  password: '',
  emailError: '',
  passwordError: '',
  passwordStrength: '',
  isEmailValid: false,
  isPasswordValid: true,
  isValid: false,
  isTouched: false
}

// TODO this is crap have to refactor to a better solution cause now if somedody nees to add a field for validation he has to change the types, the reducer and a bacnch of crap . have to make the validators general and decouple the logic for each validation maybe to a new method. 
export const useValidation = () => {
  const [state, dispatch] = useReducer(validationReducer, initialState)

  // const { isValid, isPasswordValid, isEmailValid } = state
  // console.log('email: ', isEmailValid, ' password: ', isPasswordValid, ' general: ', isValid  )

  useEffect(() => {
    if (state.isEmailValid && state.isPasswordValid) {
      dispatch({ type: ActionTypes.SET_IS_VALID, payload: true })
    } else {
      dispatch({ type: ActionTypes.SET_IS_VALID, payload: false })
    }
  }, [state.isEmailValid, state.isPasswordValid])

  // validators
  const emailValidator = (email: string) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/    
    if (!regex.test(email) && state.isTouched) {
      dispatch({ type: ActionTypes.SET_EMAIL_ERROR, payload: 'Please provide a valid email' })
      dispatch({ type: ActionTypes.SET_EMAIL_IS_VALID, payload: false })
      // is touched and no error 
    } else if (state.isTouched) {
      dispatch({ type: ActionTypes.SET_EMAIL_IS_VALID, payload: true })
    }
  }

  const passwordValidator = (password: string, getTracker: IGetTracker) => {
    if (!state.isTouched) {
      return
    }
    return
    
    const tracker = getTracker(password)

    let error = null;

    if (!tracker.hasEightChars) {
      error = `lenght has to be at least 8 characters your pass is ${password.length}`
    }

    if (!tracker.number) {
      error = 'password has to have at least one number'
    }
    
    if (!tracker.specialChar) {
      error = 'password has to have at least one special character'
    }

    if (!tracker.upperCase) {
      error = 'password has to have at least one uppeCase letter'
    }

    if (error) {
      dispatch({ type: ActionTypes.SET_PASSWORD_ERROR, payload: error })
      dispatch({ type: ActionTypes.SET_PASSWORD_IS_VALID, payload: false })
    } else if (state.isTouched) {
      dispatch({ type: ActionTypes.SET_PASSWORD_IS_VALID, payload: true })
    }
  }

  // handlers
  const handleEmailChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionTypes.SET_EMAIL, payload: value })
    emailValidator(value)
  }

  const handlePasswordChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionTypes.SET_PASSWORD, payload: value })

    // TODO strength for now can only be tier 1 or mirror.have to check how complex is the pass and not only the length . how many uppercase, special chars, no repeated char etc
    const passStrength = getPasswordStrength(value, getTracker)
    dispatch({ type: ActionTypes.SET_PASSWORD_STRENGTH, payload: passStrength })
    passwordValidator(value, getTracker)
  }


  // TODO: this affects all the inputs inside the form, i have to make it to affect each input seperatelly but in an elegant fashion. i don't want to put extra field to state for each input if it's possible 
  const handleInputBlur = () => {
    dispatch({ type: ActionTypes.SET_IS_TOUCHED })
  }

  return {
    email: state.email,
    emailError: state.emailError,
    password: state.password,
    passwordError: state.passwordError,
    passwordStrength: state.passwordStrength,
    isTouched: state.isTouched,
    isValid: state.isValid,
    handleEmailChange,
    handlePasswordChange,
    handleInputBlur
  }
}
