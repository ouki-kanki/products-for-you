import { useCallback, useEffect } from 'react';


export const useDebouncedEffect = (effect: () => void, delay: number, deps: Array<() => void | string | number>) => {
  const debouncedEffect = useCallback(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay)


    return () => {
      clearTimeout(handler)
    }

  }, [effect, delay])


  useEffect(debouncedEffect, [deps, debouncedEffect])
}