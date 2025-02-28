import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams, useLoaderData } from 'react-router-dom'

export const useSort = (initValue: string) => {
  const [searchParams,  setSearchParams] = useSearchParams()

  const paramsObj = {}
  for (let [key, value] of searchParams.entries()) {
    // TODO: fix the types
    paramsObj[key] = value
  }

  const sortValue = paramsObj['sort_by']


  const handleChangeSort = (value: string) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams)
      newParams.set('sort_by', value)

      return newParams
    })
  }

  return {
    sortValue,
    handleChangeSort
  }
}


