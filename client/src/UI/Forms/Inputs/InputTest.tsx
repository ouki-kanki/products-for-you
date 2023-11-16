import React from 'react'


interface IInputBase {
  variant?: 'primary' | 'secondary'
  label?: never 
}

interface IInputWithLabel extends Omit<IInputBase, 'label'> {
  hasLabel: true,
  label: string
}

type IInput =  IInputWithLabel | IInputBase

export const InputTest = ({ variant, hasLabel, label }: IInput) => {

  return (
    <input
    />
  )
}
