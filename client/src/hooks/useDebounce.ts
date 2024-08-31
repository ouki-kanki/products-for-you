import { useCallback, useEffect, useState } from 'react';


export const useDebounce = (callback: (value?: string) => void, delay: number, deps: Array<() => void | string | number>) => {
  const debouncedEffect = useCallback(() => {
    const handler = setTimeout(() => {
      // callback.apply(arguments)
      callback()
    }, delay)


    return () => {
      clearTimeout(handler)
    }

  }, [callback, delay])


  useEffect(debouncedEffect, [deps, debouncedEffect])
}

export const useDebouncedValue = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return (): void => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}
