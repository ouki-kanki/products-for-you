export const useScrollToTop = () => {
  const srollToTop = () => {
    return new Promise((resolve, reject) => {
      if (window.scrollY === 0) {
        return resolve(true)
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

      const isOnTop = () => {
        if (window.scrollY === 0) {
          resolve(true)
          window.removeEventListener('scroll', isOnTop)
        }
      }


      window.addEventListener('scroll', isOnTop)
    })
  }

  return srollToTop
}
