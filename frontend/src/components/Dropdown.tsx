import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  options: (string | Option)[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
  error,
  placeholder = "Select an option",
  fullWidth = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to { label, value } objects
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInputClass = (hasError: boolean) => {
    return `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-[#1A1A1A] border transition-all duration-200 shadow-sm text-gray-900 dark:text-white focus:outline-none ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
        : "border-gray-200 dark:border-[#2A2A2A] focus:border-[#9B6DFF] focus:ring-2 focus:ring-[#9B6DFF]/20 dark:focus:border-[#F2FF53] dark:focus:ring-[#F2FF53]/20"
    }`;
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : "w-fit"} ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-medium text-gray-500 dark:text-[#71717A] mb-1.5">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${getInputClass(!!error)} flex cursor-pointer items-center justify-between text-left`}
      >
        <span className={selectedOption ? "" : "text-gray-400 dark:text-[#71717A]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 dark:text-[#71717A] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] shadow-xl duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {normalizedOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-[#9B6DFF]/10 hover:text-[#9B6DFF] dark:hover:bg-[#F2FF53]/10 dark:hover:text-[#F2FF53] ${
                  value === option.value
                    ? "bg-[#9B6DFF]/5 font-medium text-[#9B6DFF] dark:bg-[#F2FF53]/5 dark:text-[#F2FF53]"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-1.5 text-[12px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
