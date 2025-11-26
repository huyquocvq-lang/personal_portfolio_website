import React from 'react';

interface SocialIcon {
  name: string;
  icon: string;
  iconAlt?: string;
  url?: string;
}

interface SocialIconsProps {
  icons: SocialIcon[];
  className?: string;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({
  icons,
  className = '',
}) => {
  return (
    <div className={`flex gap-4 items-center justify-end ${className}`}>
      {icons.map((social, index) => (
        <a
          key={index}
          href={social.url || '#'}
          className="relative shrink-0 w-8 h-8 hover:opacity-70 transition-opacity"
          aria-label={social.name}
        >
          <img
            src={social.icon}
            alt={social.iconAlt || social.name}
            className="w-full h-full object-contain"
          />
        </a>
      ))}
    </div>
  );
};

