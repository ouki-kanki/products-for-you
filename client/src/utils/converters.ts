// TOOD: this does not handle arrays inside the object
import { isEmpty } from "./objUtils"

export const convertSnakeToCamelV2 = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = key.replace(/_([a-zA-Z0-9])/g, (_, match) => match.toUpperCase())
    acc[camelKey] = value
    return acc
  }, {} as Record<string, unknown>)
}


/**
 * accepts an object, converts keys from snakecase to camelcase recursively.the convertion happens inplace
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

/** data has to be copied. this mutates the objects */
export const convertSnakeToCamelArray = (data: Array<Record<string, unknown>>): Array<Record<string, unknown>> => {
  return data.map(item => {
    if (!isEmpty(item)) {
      convertSnakeToCamel(item)
    }
    return item
  })
}

interface customConvertion {
  source: string;
  target: string;
}

interface ConvertCamelToSnakeArr<T> {
  data: T[];
  omitedKeys?: string[];
  customConvertions?: customConvertion[]
}

interface ConvertCamelToSnake {
  data: Record<string, unknown>;
  omitedKeys?: string[];
  customConvertions?: customConvertion[]
}

export const convertCamelToSnake = <T>({ data, omitedKeys, customConvertions }: ConvertCamelToSnake) => {
    return Object.keys(data as Record<string, unknown>).reduce((acc, key) => {

      // handle omited values
      if (omitedKeys && omitedKeys.length > 0) {
        for (const keyToOmit of omitedKeys) {
          if (key === keyToOmit) {
            acc[key] = data[key]
            return acc
          }
        }
      }

      // handle special convertions
      if (customConvertions && customConvertions.length > 0) {
        for (const custom of customConvertions) {
          if (key === custom.source) {
            acc[custom.target] = data[key]
            return acc
          }
        }
      }

      const snake = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
      if (snake === 'product_id') {
        // server for produt_id needs the key 'product_item
        acc['product_item'] = data[key]
      } else if (snake === 'variation_name' || snake === 'product_icon') {
        // do not convert
        return acc
      } else {
        acc[snake] = data[key]
      }
      return acc
    }, {} as Record<string, unknown>) as T
}

/**
 *
 * @param data the items array
 * @param omitedKeys an array with the keys to omit
 * @param customConvertions an array of objects { source , target } where if the item in items array contains the source key the name of the key will then converted to target
 * @returns
 */
export const convertCamelToSnakeArr = <T>({ data, omitedKeys, customConvertions }: ConvertCamelToSnakeArr<T>) => {
  if (! Array.isArray(data)) {
    throw new TypeError("data is not an array")
  }

  if (data.length === 0) {
    throw new RangeError('array cannot be empty for the conversion to occure')
  }
  return data.map(item => {
    return convertCamelToSnake({
      data: item,
      omitedKeys,
      customConvertions
    })
  })
}


/**
 * omit the values that are not needed by the server
 * @param items - cart items from locale storage
 * @returns
 */
export const prepareCartItems = (items: ICartItem[]) => {
  return items && items.map(({ price, productId, quantity }) => ({ price, uuid: productId, quantity}))
}
