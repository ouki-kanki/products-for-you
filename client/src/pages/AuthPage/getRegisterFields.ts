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

interface RegisterFieldsProps {
  hadleUserNameChange: (e: Ievent) => void,
  handleEmailChange: (e: Ievent) => void,
  handlePasswordChange: (e: Ievent) => void,
  username: string,
  email: string,
  password: string,
  handleInputBlur: () => void,
  emailError: string | null ,
  passwordError: string | null
}




// TODO: add isRequired -> will put a star at the end of the field if it is required
export const getRegisterFields = ({
  hadleUserNameChange,
  handleEmailChange,
  handleInputBlur,
  handlePasswordChange,
  username,
  email,
  password,
  emailError,
  passwordError,
}: RegisterFieldsProps): Array<IloginInput> => (
  [
    {
      id: 1,
      name: 'usename',
      label: 'UserName',
      value: username,
      placeholder: '',
      onChange: hadleUserNameChange,
      onBlur: handleInputBlur,
      onFocus: handleInputBlur,
      error: ''
    },
    {
      id: 2,
      name: 'email',
      label: 'Email',
      value: email,
      placeholder: '',
      onChange: handleEmailChange,
      onBlur: handleInputBlur,
      onFocus: handleInputBlur,
      error: emailError
    },
    {
      id: 3,
      label: 'Password',
      name: 'password',
      value: password,
      placeholder: 'Enter password',
      type: 'password',
      onChange: handlePasswordChange,
      onBlur: handleInputBlur,
      onFocus: handleInputBlur,
      error: passwordError,
    },
    {
      id: 4,
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
