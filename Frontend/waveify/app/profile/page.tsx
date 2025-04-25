"use client"
import BeatItem from "@/component/BeatItem";
import ButtonLogin from "@/component/ButtonLogin";
import { useAuth } from "@/providers/AuthProvider";

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="
        p-4
        bg-[var(--bgPage)]
        rounded-lg
        w-full h-full
        overflow-hidden
        overflow-y-auto">
            <div className="text-[var(--text)] mb-2 flex-col gap-y-6">

                <h1 className="p-6 mb-4  text-3xl font-semibold">
                    Profile, {user?.userName}  | {user?.subTitle} User
                </h1>
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
                    <div
                        className="
                    relative 
                    aspect-square 
                    w-full
                    h-full 
                    rounded-md 
                    overflow-hidden
                    bg-black
                    ">
                        {/* <Image className="object-cover" src={imagePath || "/images/music-placeholder.png"} fill alt="Image" /> */}
                    </div>
                    <div>
                    <h1 className="p-6 mb-4  text-3xl font-semibold">
                            NickName
                    </h1>
                    <ButtonLogin className="w-44 ml-5 font-semibold ">
                        Subscribe
                    </ButtonLogin>
                    <ButtonLogin className="w-44 mt-5 ml-5 bg-purple-500 font-semibold ">
                        Donate
                    </ButtonLogin>
                    </div>
                    <h1 className="p-6 mb-4  text-base font-semibold">
                        Plays: 29923
                        Like: 1999
                        Subscribe: 3232
                    </h1>
                    
                </div>
                <h1 className="p-6 mb-4  text-3xl font-semibold">
                    Tracks
                </h1>
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
                    <BeatItem />
                    <BeatItem />
                    <BeatItem />

                </div>
                <h1 className="p-6 mb-4  text-3xl font-semibold">
                    Beats
                </h1>
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
                    <BeatItem />
                    <BeatItem />
                    <BeatItem />
                </div>
                {/* <ul className="pl-4 flex items-center ">
                    <h1 className="text-2xl  font-bold text-base mb-4 pt-b ">Your Username: {user?.userName}</h1>
                    <ButtonLogin className="ml-20 mb-4 w-50">Change Username</ButtonLogin>
                </ul>
                <ul className="pl-4 flex items-center ">
                    <h1 className="text-2xl font-bold text-base mb-4 pt-b ">Your Email: {user?.email}</h1>
                    <ButtonLogin className="ml-20 mb-4 w-50">Change Email</ButtonLogin>
                </ul>
                <ul className="pl-4 flex items-center ">
                    <h1 className="text-2xl font-bold text-base mb-4 pt-b ">You Password: *** {user?.paw}</h1>
                    <ButtonLogin className="ml-20 mb-4 w-50">Change Password</ButtonLogin>
                </ul> */}


            </div>
        </div>
    );
};

export default Profile;