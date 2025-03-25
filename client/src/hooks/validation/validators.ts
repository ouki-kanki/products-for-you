export const passWordValidator = (value: string): string | null => {
  if (value.length < 8) {
    return "passoword have to be more than 8 characters"
  }
  return null;
}

export const notEmptyValidator = (value: string): string | null => {
  if (value.length === 0) {
    return "field cannot be empty"
  }
  return null
}
