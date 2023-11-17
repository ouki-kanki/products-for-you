import { useState } from 'react'
import type { Ran } from '../types';

interface IValidation {
  isValid: boolean;
  errors: {
    emailError?: string;
    passwordError?: string;
    isEmptyError?: string
  },
  passwordStrength: string
}

type TrackerField = RegExpMatchArray | null

interface IPasswordTracker {
  upperCase: TrackerField;
  number: TrackerField;
  specialChar: TrackerField;
  hasEightChars: TrackerField;
  hasTwelveChars: TrackerField;
}

const passHash = {
  1: 'tier 5',
  2: 'tier 4', 
  3: 'tier 3',
  4: 'tier 2',
  5: 'tier 1',
  6: 'mirror tier'
}


/**
 * @typedef {Object} ValidationObj
 * @property {booelan} isValid
 * @property {Object} errors
 * @property {string} passwordStrength
 */

/**
 * @typedef {Object} MainValObj
 * @property {string} email
 * @property {function} setEmail
 * @property {string} password
 * @property {function} setPassword
 * @property {function} validateInputs
 * @property {ValidationObj} validationObj
 */

/**
 * @param 
 * @returns {MainValObj} object with validation parameters
 * @property {Object} validationObj -  
 */ 
export const useValidation = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationObj, setValidation] = useState<IValidation>({
    isValid: false,
    errors: {},
    passwordStrength: ''
  })


  // ** email validation **
  const validateEmail = (value: string): string | undefined => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    return regex.test(value) ? undefined : 'Please provide a valid email address'
  }

  
  // ** main validation for pass **
  const validatePassword = (value: string) => {
    const hasUppercase = /[A-Z]g/
    const hasNumeric = /[0-9]/g
    const hasASpecialCharacter = /[#?!@$%~^*-]/g
    const isAtLeastEightChars = /.{8,}/g
    const isAtLeastTwelveChars = /.{12,}/g

    const passwordTracker: IPasswordTracker = {
        upperCase: value.match(hasUppercase),
        number: value.match(hasNumeric),
        specialChar: value.match(hasASpecialCharacter),
        hasEightChars: value.match(isAtLeastEightChars),
        hasTwelveChars: value.match(isAtLeastTwelveChars)
      }

    const getPasswordStrength = (tracker: IPasswordTracker) => {
      // TODO finde a more elegant way 
      const trackerlength: Exclude<Ran<6>, 0> = Object.keys(tracker).length as Exclude<Ran<6>, 0>
      
      if (!tracker.hasEightChars) {
        return 'insufficient length'
      }

      if (Object.keys(tracker).length >= 5 && tracker.hasTwelveChars) {
        return passHash[6]
      } else {
          return passHash[trackerlength]
      }
    }

    const validatePass = (tracker: IPasswordTracker) => {
      if (!tracker.hasEightChars) {
        return 'length has to be at least 8 characters'
      }

      if (!tracker.number) {
        return 'password has to have at least one number'
      }

      if (!tracker.specialChar) {
        return 'password has to have at least one special character'
      }

      if (!tracker.upperCase) {
        return 'passs has to have at least one uppercase letter'
      } 
      return undefined
    }  
    return {
      passwordStrength: getPasswordStrength(passwordTracker),
      passwordError: validatePass(passwordTracker)
    }
  }

  // ** main Validation **
  const validateInputs = () => {
    const { passwordStrength, passwordError } = validatePassword(password)
    const emailError = validateEmail(email)

    const isValid = !passwordError && !emailError

    setValidation({
      isValid,
      errors: {
        passwordError,
        emailError
      },
      passwordStrength
    })

  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    validateInputs,
    validationObj
  }
}
