import React from 'react';

interface ProjectCardProps {
  image?: string;
  imageAlt?: string;
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
  shadowVariant?: 'small' | 'medium' | 'large';
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  imageAlt = 'Project image',
  title,
  description,
  linkText = 'View In Dribbble',
  linkUrl,
  shadowVariant = 'medium',
  className = '',
}) => {
  const shadowClasses = {
    small: 'shadow-[0px_0px_32px_0px_rgba(0,0,0,0.15)]',
    medium: 'shadow-[0px_5.333px_16px_0px_rgba(0,0,0,0.15)]',
    large: 'shadow-[0px_5.333px_32px_0px_rgba(0,0,0,0.15)]',
  };

  return (
    <div
      className={`bg-white flex flex-col items-start w-full ${shadowClasses[shadowVariant]} rounded-lg md:rounded-xl overflow-hidden ${className}`}
    >
      {image && (
        <div className="h-48 md:h-64 lg:h-80 xl:h-[400px] relative w-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-6 md:gap-8 items-start p-6 md:p-8 w-full">
        <div className="flex flex-col gap-2 md:gap-2.5 items-start w-full">
          <h3 className="font-bold text-2xl md:text-3xl lg:text-[32px] leading-[1.4] text-[#282938] w-full">
            {title}
          </h3>
          <p className="font-normal text-base md:text-lg leading-[1.5] text-[#1c1e53] w-full">
            {description}
          </p>
        </div>
        {linkUrl && (
          <a
            href={linkUrl}
            className="border-b border-[#5e3bee] flex gap-3 md:gap-5 items-center pb-2 md:pb-2.5 text-black hover:text-[#5e3bee] transition-colors"
          >
            <span className="font-semibold text-sm md:text-base leading-[1.5]">{linkText}</span>
            <div className="relative shrink-0 w-3 h-3 md:w-4 md:h-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

