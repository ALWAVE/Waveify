import { useEffect, useState } from "react"

export default function useIsOverflowing(ref: React.RefObject<HTMLElement>) {
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const checkOverflow = () => {
      if (!element) return
      setIsOverflowing(element.scrollWidth > element.clientWidth)
    }

    checkOverflow()

    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [ref])

  return isOverflowing
}
