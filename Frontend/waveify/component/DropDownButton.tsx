"use client";
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

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

const DropdownButton = forwardRef<HTMLSelectElement, DropdownButtonProps<string>>(
  ({ className, options, disabled, type = "", premiumUser = false, value, onChange, ...props }, ref) => {
    const renderedOptions = options.filter((option) => !option.premiumOnly || premiumUser);

    const isValuePresent = renderedOptions.some((opt) => opt.value === value);
    const fallbackOption = !isValuePresent && value
      ? { label: value, value, isDisabled: true }
      : null;

    return (
      <div className="relative inline-block w-full">
        <select
          ref={ref}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={twMerge(`
            w-full
            rounded-full
            border border-neutral-700
            
            px-4 py-3
            text-sm text-[var(--text)] font-semibold
            disabled:cursor-not-allowed disabled:opacity-50
            transition
            appearance-none
            cursor-pointer
            focus:outline-none
            focus:ring-2 focus:ring-rose-500
            focus:border-rose-500
            hover:border-rose-500
            pr-10
          `, className)}
          {...props}
        >
          {fallbackOption && (
            <option value={fallbackOption.value} disabled>
              {fallbackOption.label}
            </option>
          )}

          {renderedOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.isDisabled}
              style={{ cursor: "pointer" }}
              className={twMerge(
                "bg-neutral-900 text-[var(--text)]",
                option.isDisabled && "opacity-50"
              )}
            >
              {option.premiumOnly && "⭐ "}
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="h-4 w-4 text-[var(--text)] transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);

DropdownButton.displayName = "DropdownButton";
export default DropdownButton;
