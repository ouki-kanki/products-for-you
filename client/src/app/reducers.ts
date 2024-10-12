import { ActionChangeField, ActionSetProfileData, ActionTypesProfile } from "./actions"

export const fieldsReducer = <T>(state: T, action: ActionChangeField | ActionSetProfileData) => {
  switch(action.type) {
    case ActionTypesProfile.CHANGE:
      return {
        ...state,
        [action.name]: action.value
      }
    case ActionTypesProfile.SET_PROFILE_DATA:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
