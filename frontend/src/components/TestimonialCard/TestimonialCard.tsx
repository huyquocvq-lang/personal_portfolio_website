import React from 'react';

interface TestimonialCardProps {
  stars?: string;
  starsAlt?: string;
  quote: string;
  avatar?: string;
  avatarAlt?: string;
  name: string;
  company: string;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  stars,
  starsAlt = 'Rating stars',
  quote,
  avatar,
  avatarAlt = 'Avatar',
  name,
  company,
  className = '',
}) => {
  return (
    <div
      className={`border border-[#006b6a] w-full rounded-lg md:rounded-xl ${className}`}
    >
      <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 items-start p-6 md:p-8 lg:p-10 rounded-lg md:rounded-xl w-full">
        {stars && (
          <div className="h-5 md:h-6 shrink-0 w-32 md:w-40">
            <img src={stars} alt={starsAlt} className="w-full h-full object-contain" />
          </div>
        )}
        <p className="font-normal leading-[1.5] text-base md:text-lg text-[#1c1e53] w-full">
          {quote}
        </p>
        <div className="flex gap-4 md:gap-5 items-center shrink-0">
          {avatar && (
            <div className="relative shrink-0 w-12 h-12 md:w-16 md:h-16 lg:w-[74.667px] lg:h-[74.667px]">
              <img
                src={avatar}
                alt={avatarAlt}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          )}
          <div className="flex flex-col items-start leading-[1.5] text-base md:text-lg">
            <p className="font-semibold text-[#282938]">{name}</p>
            <p className="font-normal text-[#1c1e53]">{company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

