import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonLoginProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const ButtonLogin = forwardRef<HTMLButtonElement, ButtonLoginProps>(({
    className,
    children,
    disabled,
    type = "button",
    ...props
}, ref) => {
    return (
        <button

            type={type}
            className={twMerge(`
                w-full
                rounded-full
                bg-rose-500
                border
                border-transparent
                px-3
                py-2
                disabled:cursor-not-allowed
                disabled:opacity-50
                text-black
                font-bold
                hover:opacity-75
                transition
                hover:scale-105 cursor-pointer
                `, className
            )}
            disabled={disabled}
            ref={ref}
            {...props}>
            {children}
        </button>
    )
})


ButtonLogin.displayName = "Button"
export default ButtonLogin;