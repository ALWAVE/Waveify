
import PageTitle from "@/component/PageTitle";
import ThemeSwitcher from "@/component/ThemeSwitcher";
import Image from "next/image";

const Settings = () => {

    return (
        <div className="
        p-4
        bg-[var(--bgPage)]
        rounded-lg
        w-full h-full
        overflow-hidden
        overflow-y-auto
        text-[var(--text)]">
            <div className="mb-2 flex-col gap-y-6">

                <PageTitle title="Settings" />
                    

                <ul className="pl-4">

                    <h1 className="text-2xl font-bold text-base mb-4">Пример выпадающей кнопки</h1>
                    <div className="">
                        <h1 className="mb-4 text-3xl font-semibold">
                            Free Theme
                        </h1>

                        <ThemeSwitcher themeActiveted="dark" src="./skeleton-dark.png">
                          

                        </ThemeSwitcher>
                        <ThemeSwitcher themeActiveted="light" src="./skeleton-light.png" />
                        <h1 className=" mb-4 text-3xl font-semibold">
                            Premium Theme
                        </h1>
                        <ThemeSwitcher themeActiveted="woody" src="./skeleton-req-waveify-premium.png" />
                        <ThemeSwitcher themeActiveted="brown" src="./skeleton-req-waveify-premium.png" />
                        <ThemeSwitcher themeActiveted="premium" src="./skeleton-req-waveify-premium.png"/>
                        <h1 className=" mb-4 text-3xl font-semibold">
                            Exclusive Theme
                        </h1>
                        <ThemeSwitcher themeActiveted="agressive" src="./skeleton-req-waveify-premium.png"/>
                        <ThemeSwitcher themeActiveted="blackedition" src="./skeleton-req-waveify-premium.png"/>

                    </div>
                </ul>



            </div>
        </div>
    );
};

export default Settings;