import React from 'react';
import { SectionTitle } from '../SectionTitle';
import { Container } from '../Container';

interface AboutSectionProps {
  image?: string;
  imageAlt?: string;
  subtitle?: string;
  title: string;
  description: string | string[];
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  image,
  imageAlt = 'About me',
  subtitle = 'About',
  title,
  description,
  className = '',
}) => {
  const descriptionText = Array.isArray(description) ? description : [description];

  return (
    <section className={`py-16 md:py-24 lg:py-32 ${className}`}>
      <Container maxWidth="xl" className="w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center w-full">
          {image && (
            <div className="h-64 md:h-96 lg:h-[500px] xl:h-[600px] relative w-full lg:w-1/2 flex-shrink-0">
              <img
                src={image}
                alt={imageAlt}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-6 md:gap-8 items-start w-full lg:w-1/2">
            <SectionTitle subtitle={subtitle} title={title} align="left" />
            <div className="font-normal leading-[1.5] text-lg md:text-xl lg:text-2xl text-[#1c1e53] w-full">
              {descriptionText.map((para, index) => (
                <p key={index} className={index < descriptionText.length - 1 ? 'mb-4' : ''}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

