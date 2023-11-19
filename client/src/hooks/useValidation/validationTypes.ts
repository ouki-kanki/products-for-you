export type TrackerField = RegExpMatchArray | null

export interface IPasswordTracker {
  upperCase: TrackerField;
  number: TrackerField;
  specialChar: TrackerField;
  hasEightChars: TrackerField;
  hasTwelveChars: TrackerField;
}

export type IGetTracker = (password: string) => IPasswordTracker

export interface IValidationState {
  email: string;
  password: string;
  emailError: string | null;
  passwordError: string | null;
  passwordStrength: string;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  isValid: boolean;
  isTouched: boolean;
}

export const enum ActionTypes {
  SET_EMAIL,
  SET_EMAIL_ERROR,
  SET_PASSWORD,
  SET_PASSWORD_ERROR,
  SET_PASSWORD_STRENGTH,
  SET_IS_TOUCHED,
  SET_EMAIL_IS_VALID,
  SET_PASSWORD_IS_VALID,
  SET_IS_VALID
}

export type IValidationAction = 
  | { type: ActionTypes.SET_EMAIL,  payload: string}
  | { type: ActionTypes.SET_EMAIL_ERROR,  payload: string | null}
  | { type: ActionTypes.SET_PASSWORD,  payload: string}
  | { type: ActionTypes.SET_PASSWORD_ERROR,  payload: string | null}
  | { type: ActionTypes.SET_PASSWORD_STRENGTH,  payload: string}
  | { type: ActionTypes.SET_IS_VALID,  payload: boolean}
  | { type: ActionTypes.SET_EMAIL_IS_VALID, payload: boolean}
  | { type: ActionTypes.SET_PASSWORD_IS_VALID, payload: boolean}
  | { type: ActionTypes.SET_IS_VALID,  payload: boolean}
  | { type: ActionTypes.SET_IS_TOUCHED }



// TODO: check how to type the reducer using the above generic approach !!!
// export type IValidationAction = {
//   type: IAction,
//   payload: string
// }

// export type IValidationAction<T extends IAction, P = void> = P extends undefined
//   ? { type: T }
//   : { type: T; payload: P }

// export type IValidationAction = IActionAndPayload | IActionNoPayload