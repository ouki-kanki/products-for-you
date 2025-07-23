export function isEmpty(obj: object): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

export const haveSameValue = (a: Record<string, unknown>, b: Record<string, unknown>): boolean => {
  let flag = true
  Object.keys(a).forEach((key) => {
    if (a[key] !== b[key]) {
      flag = false
    }
  })
  return flag
}

