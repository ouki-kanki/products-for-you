/**
 * accepts an object, converts keys from snakecase to camelcase
 * @param obj 
 * @returns 
 */
export const convertSnakeToCamel = (obj: Record<string, unknown>): void => {
  for (const key in obj) {
    // if the key has an obj as value
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      convertSnakeToCamel(obj[key] as Record<string, unknown>) 
    }
    // if the key has an aray as value
    if (Array.isArray(obj[key])) {
      obj[key].forEach(item => {
        convertSnakeToCamel(item)
      })
    }
    
    if ((/_/).test(key)) {
      const newKey = key.replace(/_([a-zA-Z0-9])/g, (_, match) => match.toUpperCase())
      obj[newKey] = obj[key]
      delete obj[key]
    }

  }
}