

const TitleBarLogo = () => {
    return (

        <div className="flex items-center font-bold">
            <img
                className="mr-2 h-7 rounded-md p-1 shadow-md"
                src={"/Waveify_Logo.png"}
                alt="Waveify"
            />
            <div>
                <p className="hidden md:block text-[var(--text)]">
                    Waveify
                </p>
                <p className="hidden md:block text-xs bg-gradient-to-r from-rose-500 to-cyan-100 bg-clip-text text-transparent">
                    Stable v1
                </p>
            </div>



        </div>
    );
};

export default TitleBarLogo;