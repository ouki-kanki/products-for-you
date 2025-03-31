import { useCallback, useReducer, useEffect, useMemo } from "react";
import { notEmptyValidator } from "./validators";

const enum ActionType {
  REGISTER = "REGISTER",
  CHANGE = "CHANGE",
  TOUCH = "TOUCH",
  VALIDATE_FORM = "VALIDATE_FORM"
}

export interface Field {
  isTouched: boolean;
  value: string;
  required: boolean;
}

interface ValidationState {
  fields: Record<string, Field>;
  errors: Record<string, string[] | null>;
  isFormValid: boolean;
}

export type Validator = (value: string) => string | null

type ValidationAction =
  | { type: ActionType.REGISTER, payload: { name: string, validators?: Validator[] } }
  | { type: ActionType.CHANGE, payload: { name: string, value: string, validators?: Validator[] } }
  | { type: ActionType.TOUCH, payload: { name: string, validators?: Validator[] }}
  | { type: ActionType.VALIDATE_FORM, payload: boolean}


  const initialState: ValidationState = {
    fields: {},
    errors: {},
    isFormValid: false
  }

  const validationReducer = (state: ValidationState, { type, payload }: ValidationAction): ValidationState => {
    switch (type) {
      case ActionType.REGISTER: {
        const isRequired = payload.validators?.includes(notEmptyValidator) || false
        return {
          ...state,
          fields: {
            ...state.fields,
            [payload.name]: {
              isTouched: false,
              value: "",
              required: isRequired
            }
          }
        }
      }
      case ActionType.CHANGE: {
        let validationErrors: Record<string, string[] | null>;
        if (payload?.validators && payload.validators?.length > 0) {
          const errrorsArray = payload.validators.map(validator => validator(payload.value))
                                                    .filter(error => error !== null) as string[]
          validationErrors = {
            ...state.errors,
            [payload.name]: errrorsArray
          }
        }
        return {
          ...state,
          fields: {
            ...state.fields,
            [payload.name]: {
              ...state.fields[payload.name],
              value: payload.value,
              isTouched: true
            }
          },
          ...(validationErrors && {errors: validationErrors}) // if there are errors spread the errors
        }
      }
      case ActionType.TOUCH: {
        let validationErrors;
        if (payload.validators && payload.validators.length > 0) {
          const errorsArray = payload.validators.map(validator => validator(state.fields[payload.name]?.value))
                                                  .filter(error => error !== null) as string[]
          validationErrors = {
            ...state.errors,
            [payload.name]: errorsArray // validates the current value of the field
          }
        }
        return {
          ...state,
          fields: {
            ...state.fields,
            [payload.name]: {
              ...state.fields[payload.name],
              isTouched: true
            }
          },
          ...(validationErrors && {errors: validationErrors})
        }
      }
      case ActionType.VALIDATE_FORM:
        return {
          ...state,
          isFormValid: payload
        }
    }
  }

/**
 * it the notEmptyValidator is provided in the list of validator for the current field, this will mark the field as required
 * @param validators - accepts a list of validators returns a list of errors for each field
 * @returns
 */
export const useValidationV2 = (validators: Record<string, Validator[]>) => {
  const [state, dispatch] = useReducer(validationReducer, initialState)

  const strState = JSON.stringify(state)

  useEffect(() => {
    const parsedState: ValidationState = JSON.parse(strState)
    let isFormValid = true
    const { fields, errors } = parsedState

    Object.values(fields).forEach(field => {
      if (field.required && field.value === '' || !field.isTouched) {
        isFormValid = false
      }
    })

    Object.values(errors).forEach(error => {
      if (error && error.length > 0) {
        isFormValid = false
      }
    })

    dispatch({ type: ActionType.VALIDATE_FORM, payload: isFormValid })

  }, [strState])

  const registerField = useCallback((name: string) => {
    dispatch({ type: ActionType.REGISTER, payload: {name, validators: validators[name]} })
  }, [])

  const changeField = (name: string, value: string) => {
    dispatch({
      type: ActionType.CHANGE,
      payload: {
        name,
        value,
        validators: validators[name]
      }
    })
  }

  const touchField = (name: string) => {
    dispatch({
      type: ActionType.TOUCH,
      payload: { name, validators: validators[name] }
    })
  }

  return {
    fields: state.fields,
    errors: state.errors,
    isFormValid: state.isFormValid,
    registerField,
    changeField,
    touchField
  }
}


