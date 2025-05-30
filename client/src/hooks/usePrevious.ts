import { useRef, useEffect } from 'react';


export const usePrevious = <T extends string | number | boolean> (value: T): T | undefined => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
