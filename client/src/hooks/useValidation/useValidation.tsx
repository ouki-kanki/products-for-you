import { useReducer, ChangeEvent, Reducer, useEffect } from 'react'
import type {
  IValidationAction,
  IGetTracker,
  IValidationState
 } from './validationTypes'

import { ActionTypes } from './validationTypes';
import { getTracker, getPasswordStrength } from './helpers';

interface PasswordState {
  password: string;
  passwordError: string | null;
  passwordStrength: string;
  isPasswordValid: boolean;
  isTouched: boolean;
}

const  validationReducer: Reducer<IValidationState, IValidationAction> = (state , action): IValidationState => {
  // TODO if i destructure payload it throws errors when used inside the reducer
  const { type } = action
  switch (type) {
    case ActionTypes.SET_EMAIL:
      return { ...state, email: action.payload, emailError: ''}
    case ActionTypes.SET_EMAIL_ERROR:
      return { ...state, emailError: action.payload }
    case ActionTypes.SET_IS_TOUCHED:
      return { ...state, isTouched: true }
    case ActionTypes.SET_EMAIL_IS_VALID:
      return { ...state, isEmailValid: action.payload }
    case ActionTypes.SET_IS_VALID:
      return { ...state, isValid: action.payload }
    default:
      return state
  }
}

const passWordReducer: Reducer<PasswordState, IValidationAction> = (state, action): PasswordState => {
  switch (action.type) {
    case ActionTypes.SET_PASSWORD:
      return { ...state, password: action.payload, passwordError: '' }
    case ActionTypes.SET_PASSWORD_ERROR:
      return { ...state, passwordError: action.payload }
    case ActionTypes.SET_PASSWORD_STRENGTH:
      return { ...state, passwordStrength: action.payload }
    case ActionTypes.SET_IS_TOUCHED:
      return { ...state, isTouched: true }
    case ActionTypes.SET_PASSWORD_IS_VALID:
      return { ...state, isPasswordValid: action.payload }
    default:
      return state
  }
}

const initialState: IValidationState = {
  email: '',
  emailError: '',
  isEmailValid: false,
  isValid: false,
  isTouched: false
}

const getPassWordState = ({ password, passwordError, passwordStrength, isPasswordValid, isTouched }: PasswordState) => {
  return {
    password,
    passwordError,
    passwordStrength,
    isPasswordValid,
    isTouched,
  }
}

type Mode = 'login' | 'register'

export const useValidation = (mode: Mode = 'login') => {
  const [state, dispatch] = useReducer(validationReducer, initialState)
  const [firstPasswordState, passWordDispatch] = useReducer(passWordReducer, getPassWordState({
    password: '',
    passwordError: '',
    passwordStrength: '',
    isPasswordValid: false,
    isTouched: false, // NOT USED
  }))
  const [secondPasswordState, secondPasswordDispatch] = useReducer(passWordReducer, getPassWordState({
    password: '',
    passwordError: '',
    passwordStrength: '',
    isPasswordValid: false,
    isTouched: false, // NOT USED
  }))

  useEffect(() => {
    // debugger;
    if (mode === 'register' && firstPasswordState.isPasswordValid && secondPasswordState.isPasswordValid && state.isEmailValid) {
      dispatch({ type: ActionTypes.SET_IS_VALID, payload: true})
    }
    // TODO: check second password state and if first and second passwords are the same
    else if (mode === 'login' && state.isEmailValid && firstPasswordState.isPasswordValid) {
      dispatch({ type: ActionTypes.SET_IS_VALID, payload: true })
    } else {
      dispatch({ type: ActionTypes.SET_IS_VALID, payload: false })
    }
  }, [state.isEmailValid, firstPasswordState.isPasswordValid, secondPasswordState.isPasswordValid, mode])

  // TODO: FOR now isTouched is the same for all fields.if the user types in any of the fields is touched will trigger
  // TOOD: if user does not type isTouced will not trigger
  // TODO: seperate isTouched for eachField for better ux

  // console.log('first password is valid', firstPasswordState.isPasswordValid)

  // ---- VALIDATORS ----
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

  /**
   *
   * @param password
   * @param getTracker
   * @param dispatch callback ex: firstPasswordDispatch
   * @returns
   */
  const passwordValidator = (password: string, getTracker: IGetTracker, dispatch: React.Dispatch<IValidationAction>) => {
    if (!state.isTouched) {
      return
    }

    if (mode == 'login' && password !== '') {
      dispatch({ type: ActionTypes.SET_PASSWORD_IS_VALID, payload: true })
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
      dispatch({ type: ActionTypes.SET_PASSWORD_IS_VALID, payload: false })
    } else if (state.isTouched) {
      dispatch({ type: ActionTypes.SET_PASSWORD_IS_VALID, payload: true })
    }
  }

  const secondPasswordValidator = (firstPassword: string, secondPassword: string, dispatch: React.Dispatch<IValidationAction>) => {
    let error = null
    // check if first password is same as the second
    if (firstPassword !== secondPassword) {
      error = 'Both passwords have to be the same'
    }

    if (error) {
      dispatch({ type: ActionTypes.SET_PASSWORD_ERROR, payload: error })
    } else if (state.isTouched) {
      dispatch({ type: ActionTypes.SET_PASSWORD_IS_VALID, payload: true })
    }
  }

  const handleEmailChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionTypes.SET_EMAIL, payload: value })
    emailValidator(value)
  }

  type PasswordValidator = ( value: string, getTracker: IGetTracker, dispatch: React.Dispatch<IValidationAction> ) => void

  // TODO move getTracker to end and make it optional
  type PasswordValidatorCallback = (firstPasswordValue: string, getTracker: IGetTracker, dispatch: React.Dispatch<IValidationAction> ) => void

  // TODO: if firsPassword changes secondPassValidator is not running and there is no check if both passwords are the same. have to run the login when firstPassChanges also
  const handlePasswordChange = ({ target: { value }}: ChangeEvent<HTMLInputElement>) => (dispatch: React.Dispatch<IValidationAction>, passwordValidator: PasswordValidatorCallback) =>  {
    dispatch({ type: ActionTypes.SET_PASSWORD, payload: value })

    const passStrength = getPasswordStrength(value, getTracker)
    dispatch({ type: ActionTypes.SET_PASSWORD_STRENGTH, payload: passStrength })
    passwordValidator(value, getTracker, dispatch)
  }

  const handleInputBlur = (dispatch: React.Dispatch<IValidationAction>) => {
    dispatch({ type: ActionTypes.SET_IS_TOUCHED })
  }

  return {
    email: state.email,
    emailError: state.emailError,

    password: firstPasswordState.password,
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange(e)(passWordDispatch, passwordValidator),
    passwordError: firstPasswordState.passwordError,
    passwordStrength: firstPasswordState.passwordStrength,
    handleFirstPasswordBlur: () => handleInputBlur(passWordDispatch),
    isPassWordTouched: firstPasswordState.isTouched,

    secondPassword: secondPasswordState.password,
    secondPasswordError: secondPasswordState.passwordError,
    handleSecondPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handlePasswordChange(e)(secondPasswordDispatch, (secondPass, _, dispatch) => secondPasswordValidator(firstPasswordState.password, secondPass, dispatch)),
    secondPasswordStrength: secondPasswordState.passwordStrength,
    handleSecondPasswordBlur: () => handleInputBlur(secondPasswordDispatch),
    isSecondPasswordTouched: secondPasswordState.isTouched,

    isTouched: state.isTouched,
    isValid: state.isValid,
    handleEmailChange,
    handleInputBlur: () => handleInputBlur(dispatch),
  }
}
