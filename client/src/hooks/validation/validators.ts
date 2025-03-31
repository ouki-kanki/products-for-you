export const passWordValidator = (value: string): string | null => {
  if (value.length < 8) {
    return "password have to be more than 8 characters"
  }
  return null;
}

export const notEmptyValidator = (value: string): string | null => {
  if (!value) {
    return 'field cannot be empty'
  }
  if (value.length === 0) {
    return "field cannot be empty"
  }
  return null
}

export const emailValidator = (email: string) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  if (!regex.test(email)) {
    return 'please provide a valid email'
  }
  return null
}
