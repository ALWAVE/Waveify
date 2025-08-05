import Link from "next/link";
import SmartLink from "./SmartLink";


const TitleBarLogo = () => {
    return (

        <SmartLink href={"/"} className="no-drag flex items-center font-bold hover:scale-103 active:scale-98 transition-all duration-100">
            <img
                className="hidden md:block mb-1 h-8 rounded-md p-1 shadow-md"
                src={"/logo_new.ico"}
                alt="Waveify"
            />
            <div>
                <p  className="hidden md:block font-black text-[var(--text)]">
                    Waveify
                </p>
                {/* <p className="hidden md:block text-xs bg-gradient-to-r from-rose-500 to-cyan-100 bg-clip-text text-transparent">
                    Stable v1
                </p> */}
            </div>



        </SmartLink>
    );
};

export default TitleBarLogo;