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
  isValid: false,
  isTouched: false
}

export const useValidation = () => {
  const [state, dispatch] = useReducer(validationReducer, initialState)

  useEffect(() => {
    // TODO : this is false 
    console.log("inside the effect", state.emailError, state.passwordError, state.isTouched)
    if (state.isTouched && !state.emailError && !state.passwordError) {
      dispatch({ type: ActionTypes.SET_IS_VALID, payload: true })
    } 

  }, [state.emailError, state.passwordError, state.isTouched])

  // validators
  const emailValidator = (email: string) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/    
    if (!regex.test(email) && state.isTouched) {
      dispatch({ type: ActionTypes.SET_EMAIL_ERROR, payload: 'Please provide a valid email' })
    }
  }

  const passwordValidator = (password: string, getTracker: IGetTracker) => {
    if (!state.isTouched) {
      return
    }

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
    }
  }

  // handlers
  const handleEmailChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionTypes.SET_EMAIL, payload: value })
    emailValidator(value)
  }

  const handlePasswordChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionTypes.SET_PASSWORD, payload: value })
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
