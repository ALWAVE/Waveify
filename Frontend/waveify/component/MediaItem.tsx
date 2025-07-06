"use client"

import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import useLoadImage from "@/hooks/useLoadImage"
import usePlayer from "@/hooks/usePlayer"
import { Song } from "@/models/Song"

interface MediaItemProps {
  data: Song
  onClick?: (id: string) => void
}

const useIsOverflowing = (ref: React.RefObject<HTMLElement>) => {
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setIsOverflowing(el.scrollWidth > el.clientWidth)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [ref])

  return isOverflowing
}

const MarqueeText = ({
  text,
  isOverflowing,
  className,
}: {
  text: string
  isOverflowing: boolean
  className?: string
}) => {
  const [showMarquee, setShowMarquee] = useState(false)

  useEffect(() => {
    if (isOverflowing) {
      const timeout = setTimeout(() => setShowMarquee(true), 2000)
      return () => clearTimeout(timeout)
    } else {
      setShowMarquee(false)
    }
  }, [isOverflowing])

  return (
    <div className="relative overflow-hidden w-full">
      {!showMarquee && (
        <div className={`truncate ${className}`}>
          {text}
        </div>
      )}
      {showMarquee && (
        <div className="absolute top-0 left-0 w-full">
          <div
            className={`whitespace-nowrap animate-marquee text-ellipsis ${className}`}
            style={{ animationDuration: "8s" }}
          >
            {text}&nbsp;&nbsp;&nbsp;
          </div>
        </div>
      )}
    </div>
  )
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const player = usePlayer()
  const imageUrl = useLoadImage(data)

  const titleRef = useRef<HTMLDivElement>(null)
  const authorRef = useRef<HTMLDivElement>(null)

  const isTitleOverflowing = useIsOverflowing(titleRef as React.RefObject<HTMLElement>);
  const isAuthorOverflowing = useIsOverflowing(authorRef as React.RefObject<HTMLElement>);


  const handleClick = () => {
    if (onClick) return onClick(data.id)
    return player.setId(data.id)
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-[var(--bgPage)] w-full p-2 rounded-md min-w-0"
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image
          fill
          src={imageUrl || "/images/liked.png"}
          alt="MediaItem"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-y-1 overflow-hidden max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
        <div ref={titleRef}>
          <MarqueeText
            text={data.title}
            isOverflowing={isTitleOverflowing}
            className="text-[var(--text)] text-sm font-medium"
          />
        </div>
        <div ref={authorRef}>
          <MarqueeText
            text={`By ${data.author}`}
            isOverflowing={isAuthorOverflowing}
            className="text-neutral-400 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export default MediaItem
