import { useState } from 'react'
import type { Ran } from '../types';

interface IValidation {
  isValid: boolean;
  errors: {
    emailError?: string;
    passwordError?: string;
    isEmptyError?: string
  }
}

type TrackerField = RegExpMatchArray | null

interface IPasswordTracker {
  upperCase: TrackerField;
  number: TrackerField;
  specialChar: TrackerField;
  hasEightChars: TrackerField;
  hasTwelveChars: TrackerField;
}

export const useValidation = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [meter, setMeter] = useState(false)
  const [validation, setValidation] = useState<IValidation>({
    isValid: false,
    errors: {}
  })

  const validateEmail = (value: string): string | undefined => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    return regex.test(value) ? undefined : 'Please provide a valid email address'
  }

  
  const validatePassword = (value) => {
    const hasUppercase = /[A-Z]g/
    const hasNumeric = /[0-9]/g
    const hasASpecialCharacter = /[#?!@$%~^*-]/g
    const isAtLeastEightChars = /.{8,}/g
    const isAtLeastTwelveChars = /.{12,}/g



    const passwordTracker: IPasswordTracker = {
      upperCase: password.match(hasUppercase),
      number: password.match(hasNumeric),
      specialChar: password.match(hasASpecialCharacter),
      hasEightChars: password.match(isAtLeastEightChars),
      hasTwelveChars: password.match(isAtLeastTwelveChars)
    }

    const passHash = {
      1: 'tier 5',
      2: 'tier 4', 
      3: 'tier 3',
      4: 'tier 2',
      5: 'tier 1',
      6: 'mirror tier'
    }


    const passwordStrength = (tracker: IPasswordTracker) => {
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

  } 




  return {

  }
}
