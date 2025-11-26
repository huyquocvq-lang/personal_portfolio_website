import React from 'react';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  className?: string;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  options,
  className = '',
  rows = 4,
}) => {
  const baseInputStyles =
    'bg-white border border-[#5e3bee] rounded-md w-full font-normal text-lg leading-[1.5] text-[#282938] focus:outline-none focus:ring-2 focus:ring-[#5e3bee]';

  return (
    <div className={`flex flex-col gap-2.5 items-start w-full ${className}`}>
      {label && (
        <label className="font-normal leading-[1.5] text-lg text-[#282938] w-full">
          {label}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          className={`${baseInputStyles} p-4 h-[240px] resize-none`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={rows}
        />
      ) : type === 'select' ? (
        <div className={`${baseInputStyles} flex items-center p-4 h-16`}>
          <select
            className="flex-1 bg-transparent border-none outline-none text-[#282938]"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          >
            <option value="">{placeholder || 'Select one...'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="relative shrink-0 w-8 h-8">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12L16 20L24 12"
                stroke="#282938"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : (
        <input
          type={type}
          className={`${baseInputStyles} p-4 h-16`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
};

