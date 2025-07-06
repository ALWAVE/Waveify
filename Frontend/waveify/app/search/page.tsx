
import SearchInput from "@/component/SearchInput";

import Link from 'next/link';

const categories = [
{key: "all", label: <Link href={"search/all"}>All</Link>},
{key: "music", label: <Link href={"search/music"}>Music</Link>},
{key: "beats", label: <Link href={"search/beats"}>Beats</Link>},
{key: "playlist", label: <Link href={"search/playlist"}>Playlist</Link>},
{key: "tags", label: <Link href={"search/tags"}>Tags</Link>},
{key: "drumkits", label: <Link href={"/drumkits"}>Drum Kits</Link>},
];

const Search = () => {
    return (
        <div className="
        p-4
        bg-[var(--bgPage)]
        rounded-lg
        w-full h-full
        overflow-hidden
        overflow-y-auto">
        
              <div className="mb-2 flex-col gap-y-6">
                <h1 className=" mb-4 text-white text-3xl font-semibold">
                    Search
                </h1>
                <SearchInput/>
                <h1 className="hidden md:block mt-10 mb-4 text-white text-3xl font-semibold text-center">
                Search results for:
                </h1>
              
              </div>
           
        </div>
    )
};

export default Search;