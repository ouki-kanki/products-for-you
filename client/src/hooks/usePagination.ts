import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { isEmpty } from '../utils/objUtils'
import { useScrollToTop } from './useScrollToTop'

interface returnParams<T> {
  page: number;
  pageSize: number;
  prepareLink: (queryStringObj: T) => string;
  handleNavigate: (page: number, queryStringObj: any) => void
}

const _prepareLink = (path: string) => (page: string, queryString: string): string => {
  let queryStr = queryString

  // remove the old page from the queryString


  console.log("the que", queryString)
  queryStr += queryStr ? '&' : ''

  if (page) {
    queryStr += `page=${page}`
  }

  if (queryStr) {
    return path + '?' + queryStr
  } else {
    return path
  }
}

// *** OBSOLETE ***
const _prepareLink_old = (path: string) => (page: number, page_size: number, queryStringObj): string => {
  let queryStr = ''

  if (! isEmpty(queryStringObj)) {
    for (const [key, value] of Object.entries(queryStringObj)) {
      !queryStr ? queryStr += `?${key}=${value}` : queryStr += `&${key}=${value}`
    }
  }

  // TODO: remove the above and use the string that is created -> url_query_string

  queryStr += !queryStr ? '?' : '&'
  queryStr += `page=${page}&page_size=${page_size}` // TODO: only if page or pagesize exist

  return path + queryStr
}

// *** -- Main -- ***
/**
 * provides the component with page and page_size values,
 * fn prepareLink which can be used to Navlink & Links inside the 'to' property
 * fn nahdleNavigate
 * @param queryStringObj objects with all custom querystring params
 * @returns object
 */
export const usePagination = <T>(queryStringObj: T) => {
  const navigate = useNavigate()
  const [ searchParams ] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')
  const page_size = parseInt(searchParams.get('page_size') || '10')
  const { pathname } = useLocation()
  const scrollToTop = useScrollToTop()

  let queryString = Object.fromEntries(searchParams.entries())
  console.log("the querystring obj", queryString)
  queryString = Object.fromEntries(
    Object.entries(queryString).filter(([key]) => key !== 'page')
  )
  console.log("clean querystring", queryString)
  const urlQueryString = new URLSearchParams(queryString).toString()

  console.log("the url query", urlQueryString)

  const preparedLinkWithPath = _prepareLink(pathname)

  /**
   *
   * @param page
   */
  const handleNavigate = async (page: number): void => {
    const path = preparedLinkWithPath(page, urlQueryString)
    console.log("the final path", path)
    await scrollToTop()
    navigate(path)
  }

  return {
    // Note: preparelink is returned to be used in Navlinks
    // TODO: this has to use the new url_query_string also
    prepareLink: preparedLinkWithPath,
    handleNavigate,
    page,
    page_size
  }

}
