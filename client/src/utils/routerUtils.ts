import { useSearchParams } from "react-router-dom"


export const useListSearchParams = (omitValues?: string[]) => {
  const [searchParams] = useSearchParams()
  const params = new URLSearchParams()

  // console.log("searchparams", searchParams)

  // omit the values and construt the new URL obj
  for (const [key, value] of searchParams) {
    if (omitValues && omitValues?.length > 0 && omitValues?.includes(key)) {
      continue
    }

    const valuesArr = value.split(',')
      if (valuesArr.length > 0) {
        // follow the standard if mutl values -> foo=bar&foo=fizz
        valuesArr.forEach(value => {
          params.append(key, value)
        })
      }
    }

  return {
    paramsStr: params.toString()
  }
}
