import { useState, useEffect } from 'react'


export const useSroll = () => {
  const [isScrollingDown, setIsScrollingDown] = useState(false)

  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.scrollY
    let ticking = false;

    const handleIsScrollDirectionDown = () => {
      const srollY = window.scrollY

      if (Math.abs(srollY - lastScrollY) < threshold) {
        ticking = false;
        return
      }

      setIsScrollingDown(scrollY > lastScrollY ? true: false)
      lastScrollY = scrollY > 0 ? srollY : 0;
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleIsScrollDirectionDown);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener("scroll", onScroll)
  }, [isScrollingDown])


  return {
    isScrollingDown
  }
}