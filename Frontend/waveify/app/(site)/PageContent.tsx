"use client";
import BeatItem from "@/component/BeatItem";
import SongItem from "@/component/SongItem";
import { Song } from "@/models/Song";



interface PageContentProps {
    songs: Song[]
}
const PageContent: React.FC<PageContentProps> = ({songs}) => {

  
    if (songs.length === 0) {
        return <div className="mt-4 text-neutral-400">No songs available.</div>
    }
   
    return (
        <div className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4
      ">
        {songs.map(item => (
            <SongItem  key={item.id} data={item} />
        ))}
           {/* <BeatItem ></BeatItem> */}
            
        </div>

    );
};




export default PageContent;