import React from 'react';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  className = '',
  align = 'left',
}) => {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start';
  
  return (
    <div className={`flex flex-col gap-4 md:gap-5 ${alignClass} ${className}`}>
      {subtitle && (
        <p className="font-semibold text-sm md:text-base leading-[1.5] text-[#282938]">
          {subtitle}
        </p>
      )}
      <div className="flex flex-col gap-6 md:gap-8 w-full">
        <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.2] text-[#282938] w-full">
          {title}
        </h2>
        {description && (
          <p className="font-normal text-lg md:text-xl lg:text-2xl leading-[1.5] text-[#1c1e53] w-full">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

