import React from 'react';
import { SocialIcons } from '../SocialIcons';
import { Container } from '../Container';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  logo?: string;
  logoAlt?: string;
  menuItems?: FooterLink[];
  socialIcons?: Array<{
    name: string;
    icon: string;
    iconAlt?: string;
    url?: string;
  }>;
  credits?: {
    text: string;
    linkText?: string;
    linkUrl?: string;
  };
  footerLinks?: FooterLink[];
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  logoAlt = 'Logo',
  menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'About me', href: '#about' },
    { label: 'Contact', href: '#contact' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Portfolio', href: '#portfolio' },
  ],
  socialIcons = [],
  credits = {
    text: 'Made with 💖 by',
    linkText: 'Airdokan',
    linkUrl: 'https://airdokan.com/',
  },
  footerLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookies Settings', href: '#' },
  ],
  className = '',
}) => {
  return (
    <footer className={`bg-[#f5fcff] flex flex-col gap-12 md:gap-16 lg:gap-20 items-start py-12 md:py-16 lg:py-20 ${className}`}>
      <Container maxWidth="xl" className="w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 w-full">
          {logo && (
            <div className="h-8 md:h-10 w-48 md:w-64 lg:w-80 shrink-0">
              <img src={logo} alt={logoAlt} className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex flex-wrap font-normal gap-4 md:gap-6 lg:gap-10 items-center text-sm md:text-base lg:text-lg leading-[1.5] text-black">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="shrink-0 hover:text-[#5e3bee] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          {socialIcons.length > 0 && (
            <SocialIcons icons={socialIcons} className="w-auto" />
          )}
        </div>
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 items-center w-full mt-8 md:mt-12">
          <div className="bg-[rgba(40,41,56,0.55)] h-px shrink-0 w-full" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 w-full">
            <p className="font-normal leading-[1.5] text-xs md:text-sm text-black text-center sm:text-left">
              <span>{credits.text} </span>
              {credits.linkText && credits.linkUrl && (
                <a
                  href={credits.linkUrl}
                  className="cursor-pointer hover:text-[#5e3bee] transition-colors"
                >
                  {credits.linkText}
                </a>
              )}
            </p>
            <div className="flex flex-wrap font-normal gap-4 md:gap-6 lg:gap-8 items-center text-xs md:text-sm lg:text-base leading-[1.5] text-black">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="shrink-0 hover:text-[#5e3bee] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

