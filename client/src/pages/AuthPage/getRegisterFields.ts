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
  username: string;
  email: string;
  emailError: string | null;
  handleUserNameChange: (e: Ievent) => void;
  handleEmailChange: (e: Ievent) => void;
  password: string;
  handlePasswordChange: (e: Ievent) => void;
  passwordError: string | null;
  secondPassword: string;
  handleSecondPasswordChange: (e: Ievent) => void;
  secondPasswordError: string | null;
  handleInputBlur: () => void;
}


// TODO: add isRequired -> will put a star at the end of the field if it is required
export const getRegisterFields = ({
  username,
  handleUserNameChange,
  email,
  emailError,
  handleEmailChange,
  handleInputBlur,
  password,
  handlePasswordChange,
  passwordError,
  secondPassword,
  handleSecondPasswordChange,
  secondPasswordError
}: RegisterFieldsProps): Array<IloginInput> => (
  [
    {
      id: 1,
      name: 'usename',
      label: 'UserName',
      value: username,
      placeholder: '',
      onChange: handleUserNameChange,
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
      label: 'Type password again',
      name: 'second_passord',
      value: secondPassword,
      placeholder: 'Enter password',
      type: 'password',
      onChange: handleSecondPasswordChange,
      onBlur: handleInputBlur,
      onFocus: handleInputBlur,
      error: secondPasswordError,
    }
  ]
)
