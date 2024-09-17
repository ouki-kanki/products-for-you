import { ChangeEvent } from "react"
import type { IInputBase } from '../../UI/Forms/Inputs/Input/Input';

type Ievent = ChangeEvent<HTMLInputElement>
export interface IloginInput extends Omit<IInputBase, 'id' | 'hasLabel' | 'error'> {
  id: number,
  value: string
  onChange: () => void,
  onBlur: () => void,
  onFocus: () => void,
  error: string | null
}

// TODO: check e type
export const getLoginFields = (handleEmailChange: (e: Ievent) => void, handlePasswordChange: (e: Ievent) => void, email: string, password: string, handleInputBlur: () => void, emailError: string | null , passwordError: string | null): Array<IloginInput> => (
  [
    {
      id: 1,
      name: 'username',
      label: 'Email',
      value: email,
      placeholder: '',
      onChange: handleEmailChange,
      onBlur: handleInputBlur,
      onFocus: handleInputBlur,
      error: emailError
    },
    {
      id: 2,
      label: 'Password',
      name: 'password',
      value: password,
      placeholder: 'Enter password',
      type: 'password',
      onChange: handlePasswordChange,
      onBlur: handleInputBlur,
      onFocus: handleInputBlur,
      error: passwordError,
    }
  ]
)
