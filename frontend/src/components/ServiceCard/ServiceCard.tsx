import React from 'react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon?: string;
  iconAlt?: string;
  title: string;
  description: string;
  highlighted?: boolean;
  className?: string;
  slug?: string;
  onClick?: () => void;
}

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  iconAlt = 'Service icon',
  title,
  description,
  highlighted = false,
  className = '',
  slug,
  onClick,
}) => {
  const skillSlug = slug || generateSlug(title);
  const cardContent = (
    <div
      className={`bg-[#f5fcff] flex flex-col gap-6 md:gap-8 items-start p-6 md:p-8 rounded-lg md:rounded-xl transition-all duration-200 ${
        highlighted ? 'border-b-4 border-[#5e3bee]' : ''
      } ${onClick || slug ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-6 md:gap-8 items-start w-full">
        {icon && (
          <div className="bg-white flex gap-3 md:gap-3.5 items-center justify-center p-3 md:p-3.5 rounded-lg md:rounded-xl shadow-[0px_0px_16px_0px_rgba(0,0,0,0.1)]">
            <div className="relative shrink-0 w-12 h-12 md:w-[53.333px] md:h-[53.333px]">
              <img
                src={icon}
                alt={iconAlt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4 md:gap-5 items-start w-full">
          <h3 className="font-bold text-2xl md:text-3xl lg:text-[32px] leading-[1.4] text-[#282938] w-full">
            {title}
          </h3>
          <p className="font-normal text-sm md:text-base leading-[1.5] text-[#1c1e53] w-full">
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  if (slug || (!onClick && title)) {
    return (
      <Link to={`/skill/${skillSlug}`} className="block w-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

