import React from 'react';
import { Button } from '../Button';
import { Container } from '../Container';

interface HeroProps {
  greeting?: string;
  title: string;
  highlightedText?: string;
  description: string;
  image?: string;
  imageAlt?: string;
  onGetInTouch?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  greeting = 'Hey, I am John',
  title,
  highlightedText,
  description,
  image,
  imageAlt = 'Hero image',
  onGetInTouch,
}) => {
  return (
    <section className="bg-[#f5fcff] flex items-center py-16 md:py-24 lg:py-32 w-full">
      <Container maxWidth="xl" className="w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center w-full">
          <div className="flex flex-col gap-6 md:gap-8 items-start w-full lg:w-1/2">
            <div className="flex flex-col gap-4 md:gap-5 items-start w-full">
              {greeting && (
                <p className="font-semibold text-sm md:text-base leading-[1.5] text-[#282938]">
                  {greeting}
                </p>
              )}
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.2] text-[#282938] w-full">
                {highlightedText && title.includes(highlightedText) ? (
                  <>
                    {title.split(highlightedText)[0]}
                    <span className="text-[#5e3bee]">{highlightedText}</span>
                    {title.split(highlightedText)[1]}
                  </>
                ) : (
                  title
                )}
              </h1>
              <p className="font-normal text-lg md:text-xl lg:text-2xl leading-[1.5] text-[#1c1e53] w-full">
                {description}
              </p>
            </div>
            <div className="flex gap-4 md:gap-5 items-start pt-4 md:pt-5">
              <Button variant="primary" onClick={onGetInTouch}>
                Get In Touch
              </Button>
            </div>
          </div>
          {image && (
            <div className="h-64 md:h-80 lg:h-96 xl:h-[500px] relative w-full lg:w-1/2 flex-shrink-0">
              <img
                src={image}
                alt={imageAlt}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

