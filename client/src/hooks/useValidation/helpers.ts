import type { IPasswordTracker } from "./validationTypes"
import { Ran } from "../../types"

const passHash = {
  1: 'tier 5',
  2: 'tier 4', 
  3: 'tier 3',
  4: 'tier 2',
  5: 'tier 1',
  6: 'mirror tier'
}

export const getTracker = (password: string) => {
  const hasUppercase = /[A-Z]/g
  const hasNumeric = /[0-9]/g
  const hasASpecialCharacter = /[#?!@$%~^*-]/g
  const isAtLeastEightChars = /.{8,}/g
  const isAtLeastTwelveChars = /.{12,}/g

  return {
    upperCase: password.match(hasUppercase),
    number: password.match(hasNumeric),
    specialChar: password.match(hasASpecialCharacter),
    hasEightChars: password.match(isAtLeastEightChars),
    hasTwelveChars: password.match(isAtLeastTwelveChars)
  }
}

export const getPasswordStrength = (password: string, getTracker: (password: string) => IPasswordTracker) => {
  const tracker = getTracker(password)

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