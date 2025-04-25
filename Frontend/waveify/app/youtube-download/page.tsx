"use client"
import ButtonLogin from "@/component/ButtonLogin";
import DropdownButton from "@/component/DropDownButton";
import Input from "@/component/Input";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
const YouTubeDownloadPage = () => {
    const [isLoading, setIsLoading] = useState();
    const {user} = useAuth();
    // const [isActive, setIsActive] = useState(false);
    // const [toggleActive, setToggleActive] = useState();
    // const clearSearch = () => setSearchValue("");
    // const toggleActive = () => setToggleActive(!isActive);
    return (
        <div className="p-4 bg-[var(--bgPage)] text-[var(--text)] rounded-lg w-full h-full overflow-hidden overflow-y-auto">
            <div className="mb-2 flex flex-col gap-y-6 max-w-4xl mx-auto">
                <h1 className="p-6 mb-4 text-[var(--text)] text-3xl font-semibold text-center">
                    Download Music With YouTube
                </h1>
                <div className="flex w-full items-center gap-2">
                    <Input
                        id="url_youtube"
                        disabled={isLoading}
                        placeholder="Enter YouTube URL"
                        className="flex-1 bg-[var(--bgButton)] text-xl min-w-0 rounded-full ring-2 ring-neutral-500 "
                    />

                    <div className="relative flex-shrink-0 w-32 ">
                    <DropdownButton
                        options={[
                            { label: 'MP3', value: 'mp3' },
                            { label: 'WAV', value: 'wav', premiumOnly: true },
                        
                        ]}
                        value="mp3"
                        premiumUser={true} // или false для скрытия премиум опций
                        onChange={(e) => console.log(e.target.value)}
                        className=" px-6 py-2 text-base "
                        />
                    </div>

                    {/* <ButtonLogin className="flex-shrink-0 flex justify-center px-6 py-2 text-base w-auto">

                        Download
                        <FiDownload className="mt-1" size={18} />
                    </ButtonLogin> */}
                    <ButtonLogin
                        className="w-16 h-10 flex justify-center  items-center bg-transparent hover:scale-100 hover:bg-neutral-700 hover:opacity-100  text-neutral-400 hover:text-white ring ring-neutral-700"
                    >
                        <HiOutlineDownload size={18} />
                    </ButtonLogin>
                    
                </div>
                <h1 className="p-6 mb-4  text-3xl font-semibold text-center">
                    New Function
                </h1>
                
                  <div  className="flex w-full items-center gap-2">
                    <p className="p-6 mb-4  bg-gradient-to-r from-red-200 to-yellow-200 bg-clip-text text-transparent  text-3xl font-semibold text-center">
                    Use full function with Waveify
                    </p>
                  <h1 className="p-6 mb-4 text-neutral-600 text-base font-semibold text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex hic nostrum sit ab corporis, beatae, ratione magnam sunt laudantium reiciendis fugit. Sequi dolore alias perspiciatis ad qui unde necessitatibus distinctio!
                </h1>
                </div>
                <div  className="flex w-full items-center gap-2">
                   
                  <h1 className="p-6 mb-4 text-neutral-600 text-base font-semibold text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex hic nostrum sit ab corporis, beatae, ratione magnam sunt laudantium reiciendis fugit. Sequi dolore alias perspiciatis ad qui unde necessitatibus distinctio!
                </h1>
                <p className="p-6 mb-4 bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent text-3xl font-semibold text-center">
                        Connect Waveify Premium
                    </p>
                </div>
            </div>
        </div>
    );
};

export default YouTubeDownloadPage;