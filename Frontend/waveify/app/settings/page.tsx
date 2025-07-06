"use client";
import { useEffect, useState } from "react";
import PageTitle from "@/component/PageTitle";
import ThemeSwitcher from "@/component/ThemeSwitcher";
import ToggleSwitch from "@/component/ToggleSwitch";
import { TiMinus } from "react-icons/ti";
import { FaPlus } from "react-icons/fa";
import ButtonLogin from "@/component/ButtonLogin";
import useLibrarySettings from "@/hooks/useLibrarySettings";
declare global {
    interface Window {
        electron?: any;
    }
}

const isElectron = typeof window !== "undefined" && !!window.electron;

const Settings = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [isPremiumTheme, setIsPremiumTheme] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [ipcRenderer, setIpcRenderer] = useState<any>(null);
    const { showYourFile, setShowYourFile } = useLibrarySettings();

    const handleToggleYourFile = () => {
    setShowYourFile(!showYourFile);
    };
    useEffect(() => {
        if (isElectron) {
            setIpcRenderer(window.electron);
        }
    }, []);

    // Инициализация состояния из localStorage
    useEffect(() => {
        const savedState = localStorage.getItem("toggleSwitchState");
        if (savedState !== null) {
            setIsChecked(JSON.parse(savedState));
        }
    }, []);
    useEffect(() => {
        const savedState = localStorage.getItem("toggleSwitchStatePremiumTheme");
        if (savedState !== null) {
            setIsChecked(JSON.parse(savedState));
        }
    }, []);
    const changeZoom = (level: number) => {
        if (ipcRenderer) {
            setZoomLevel(level);
            ipcRenderer.setZoom(level / 100);
        }
    };

    // Обработчик нажатия на переключатель
    const handleToggle = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        localStorage.setItem("toggleSwitchState", JSON.stringify(newCheckedState));
    };

    const handleTogglePremiumTheme = () => {
        const newCheckedStatePremimTheme = !isPremiumTheme;
        setIsPremiumTheme(newCheckedStatePremimTheme);
        localStorage.setItem("toggleSwitchStatePremiumTheme", JSON.stringify(newCheckedStatePremimTheme));
    };
    return (
        <div className="
            p-4
            bg-[var(--bgPage)]
            rounded-lg
            w-full h-full
            overflow-hidden
            overflow-y-auto
            text-[var(--text)]
           ">
            <div className="mb-2 flex-col gap-y-6">
                <PageTitle title="Settings" />
                <ul className="pl-15 pr-15">
                    <div className="">
                        <div>
                            <h1 className="mb-4 text-xl font-semibold">Theme</h1>
                            <div className="flex">
                                <ThemeSwitcher themeActiveted="dark" src="./skeleton-dark.png" />
                                <ThemeSwitcher themeActiveted="light" src="./skeleton-light.png" />
                            </div>

                        </div>
                        {/* Вид */}
                        <div>
                            <h1 className="mb-4 mt-4 text-2xl font-semibold">Вид</h1>
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="font-medium text-sm text-[var(--textPage)]">Показать Premium темы</h1>
                                <ToggleSwitch onClick={handleTogglePremiumTheme} isChecked={isPremiumTheme} />

                            </div>
                            <div className="flex">
                                {/* Показываем премиум темы только если переключатель активен */}
                                {isPremiumTheme && (
                                    <>
                                        <ThemeSwitcher themeActiveted="woody" />
                                        <ThemeSwitcher themeActiveted="brown" />
                                        <ThemeSwitcher themeActiveted="premium" />
                                        <ThemeSwitcher themeActiveted="bright" />
                                        <ThemeSwitcher themeActiveted="ocean" />
                                        <ThemeSwitcher themeActiveted="agressive" />
                                        <ThemeSwitcher themeActiveted="blackedition" />
                                        <ThemeSwitcher themeActiveted="friend" />
                                    </>
                                )}
                            </div>
                            {isElectron && ipcRenderer && (
                                <>

                                    {/* Масштаб */}
                                    <h1 className="mb-4 mt-4 text-2xl font-semibold">Масштаб</h1>


                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm text-[var(--text)]">Стандартный</label>
                                        <label className="text-sm text-[var(--text)]">Средний</label>
                                        <label className="text-sm text-[var(--text)]">Крупный</label>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="zoom"
                                                checked={zoomLevel === 0}
                                                onChange={() => changeZoom(0)}
                                            />
                                            <label className="ml-2 text-sm text-[var(--text)]">0%</label>
                                        </div>
                                        <hr className="mx-2 border-t-[0.5px] border-neutral-600 flex-grow" />
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="zoom"
                                                checked={zoomLevel === 20}
                                                onChange={() => changeZoom(20)}
                                            />
                                            <label className="ml-2 text-sm text-[var(--text)]">20%</label>
                                        </div>
                                        <hr className="mx-2 border-t-[0.5px] border-neutral-600 flex-grow" />
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="zoom"
                                                checked={zoomLevel === 30}
                                                onChange={() => changeZoom(30)}
                                            />
                                            <label className="ml-2 text-sm text-[var(--text)]">30%</label>
                                        </div>
                                        <hr className="mx-2 border-t-[0.5px] border-neutral-600 flex-grow" />
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="zoom"
                                                checked={zoomLevel === 50}
                                                onChange={() => changeZoom(50)}
                                            />
                                            <label className="ml-2 text-sm text-[var(--text)]">50%</label>
                                        </div>
                                        <hr className="mx-2 border-t-[0.5px] border-neutral-600 flex-grow" />
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="zoom"
                                                checked={zoomLevel === 70}
                                                onChange={() => changeZoom(70)}
                                            />
                                            <label className="ml-2 text-sm text-[var(--text)]">70%</label>
                                        </div>
                                        <hr className="mx-2 border-t-[0.5px] border-neutral-600 flex-grow" />

                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="zoom"
                                                checked={zoomLevel === 80}
                                                onChange={() => changeZoom(80)}
                                            />
                                            <label className="ml-2 text-sm text-[var(--text)]">80%</label>
                                        </div>
                                        <hr className="mx-2 border-t-[0.5px] border-neutral-600 flex-grow" />

                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="zoom"
                                                checked={zoomLevel === 100}
                                                onChange={() => changeZoom(100)}
                                            />
                                            <label className="ml-2 text-sm text-[var(--text)]">100%</label>
                                        </div>

                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h1 className="font-medium text-sm text-[var(--textPage)]"></h1>
                                        <ButtonLogin className="mt-5 w-24  text-sm" onClick={() => changeZoom(0)}>Сбросить</ButtonLogin>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Медиатека */}
                        <div>
                            <h1 className="mb-4 mt-4 text-2xl font-semibold">Медиатека</h1>
                           <div className="flex items-center justify-between mb-2">
                            <h1 className="font-medium text-sm text-[var(--textPage)]">Показать все файлы на устройстве</h1>
                            <ToggleSwitch onClick={handleToggleYourFile} isChecked={showYourFile} />
                            </div>
                            {/* <div className="flex items-center justify-between mb-2">
                                <h1 className="font-medium text-sm text-[var(--textPage)]">Показать все файлы на устройстве</h1>
                                <ToggleSwitch onClick={handleToggle} isChecked={isChecked} />
                            </div> */}
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Settings;

