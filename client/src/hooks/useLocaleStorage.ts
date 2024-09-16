import { useState, useEffect, Dispatch, SetStateAction } from 'react'
type ReturnType = [boolean, Dispatch<SetStateAction<boolean>>]


export const useLocaleStorage = (): ReturnType => {
  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist') as string) || false)

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist))
  }, [persist])

  return [persist, setPersist]
}
