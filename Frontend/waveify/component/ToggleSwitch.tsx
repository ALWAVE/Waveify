"use client"
interface ToggleSwitchProps {
    onClick: () => void;
    isChecked: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onClick, isChecked }) => {
    return (
        <button
            className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-[var(--bg)] transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-rose-500"
            onClick={onClick} // Добавляем обработчик события
        >
            <input
                className="peer sr-only"
                id="AcceptConditions"
                type="checkbox"
                checked={isChecked} // Устанавливаем состояние
                readOnly // Делаем поле только для чтения
            />
            <span
                className={`absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all ${isChecked ? 'peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent' : ''}`}
            ></span>
        </button>
    );
};

export default ToggleSwitch;
