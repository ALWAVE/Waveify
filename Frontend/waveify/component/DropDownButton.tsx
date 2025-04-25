"use client"
import React, { forwardRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface DropdownButtonOption<T extends string> {
  label: string;
  value: T;
  isDisabled?: boolean;
  premiumOnly?: boolean;
}

export interface DropdownButtonProps<T extends string> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: DropdownButtonOption<T>[];
  type?: string;
  premiumUser?: boolean;
}

const DropdownButton = forwardRef<HTMLSelectElement, DropdownButtonProps<string>>(({
  className,
  options,
  disabled,
  type = '',
  premiumUser = false,
  value,
  onChange,
  ...props
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="relative inline-block w-full">
      <select
        ref={ref}
        disabled={disabled}
        value={selectedValue}
        onChange={handleChange}
        className={twMerge(`
          w-full
          rounded-full
          
          border
          border-neutral-700
          px-4
          py-2
          disabled:cursor-not-allowed
          disabled:opacity-50
          text-[var(--text)]
          font-bold
          
          transition-all
          cursor-pointer
          appearance-none
          focus:outline-none
          focus:ring-2
          focus:ring-rose-500
          hover:border-neutral-500
          pr-8
        `, className)}
        {...props}
      >
        {options.map((option) => {
          if (option.premiumOnly && !premiumUser) return null;
          
          return (
            <option
              key={option.value}
              value={option.value}
              disabled={option.isDisabled}
              className={twMerge(
                "bg-neutral-800 hover:border-neutral-500 text-[var(--text)]",
                option.premiumOnly ? "bg-gradient-to-r from-purple-500 to-pink-500 " : "",
                option.isDisabled ? "opacity-50 text-[var(--text)] bg-[var(--bg)] " : " text-[var(--text)] hover:opacity-50 "
              )}
            >
              {option.premiumOnly && "⭐ "}
              {option.label}
              {/* {option.premiumOnly && " (Premium)"} */}
            </option>
          );
        })}
      </select>
      <div className="pointer-events-none  absolute inset-y-0 right-3 flex items-center">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
});

DropdownButton.displayName = 'DropdownButton';
export default DropdownButton;