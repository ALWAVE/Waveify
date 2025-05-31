"use client"
import useSongs from "@/hooks/useSongs"
import PageContent from "./PageContent"
import { useEffect } from "react"
export default function Home() {
  const { songs, isLoading, refresh } = useSongs()
  useEffect(() => {
    refresh()
  }, []);
  return (
    
    <div className="bg-[var(--bgPage)] text-neutral-400 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
          {/* Здесь могут быть карточки */}
        </div>
      </div>

      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-[var(--text)] text-2xl font-semibold">New songs</h1>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <PageContent songs={songs} />
        )}
        {/* <div className="flex justify-between items-center mt-4">
          <h1 className="text-[var(--text)] text-2xl font-semibold">Top Rating</h1>
        </div> */}
      </div>
    </div>
  )
}
