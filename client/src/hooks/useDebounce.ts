import { useCallback, useEffect, useState, useRef } from 'react';


export const useDebounce = <T=unknown>(callback: (value?: string) => void, delay: number, deps: Array<T | (() => void) | string | number>) => {
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

export const useDebouncedFunction = <T extends any[]>(callback: (...args: T) => void, delay: number) => {
  const timeoutRef= useRef<NodeJS.Timeout | null>(null)

  const debouncedFunction = useCallback((...args: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay);
  }, [callback, delay])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedFunction
}
