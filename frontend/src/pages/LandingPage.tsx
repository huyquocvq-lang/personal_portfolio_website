import React from 'react';
import { Hero } from '../components/Hero';
import { SectionTitle } from '../components/SectionTitle';
import { ServiceCard } from '../components/ServiceCard';
import { AboutSection } from '../components/AboutSection';
import { ProjectCard } from '../components/ProjectCard';
import { TestimonialCard } from '../components/TestimonialCard';
import { ContactForm } from '../components/ContactForm';
import { Button } from '../components/Button';
import { Container } from '../components/Container';

// Image URLs from Figma (these would be replaced with actual image imports)
const images = {
  logo: 'https://www.figma.com/api/mcp/asset/2d613df7-1149-428e-a2f5-8f1fe969b468',
  heroImage: 'https://www.figma.com/api/mcp/asset/a7e31cdd-975a-4ca8-9f43-fac4c728e5b7',
  aboutMe: 'https://www.figma.com/api/mcp/asset/570b6562-30d0-4025-986a-0f1513643c94',
  productChain: 'https://www.figma.com/api/mcp/asset/494f6294-2064-44d9-9b58-f3715ad96365',
  tag: 'https://www.figma.com/api/mcp/asset/3fcad0fa-0413-49a8-9728-f2e6fdc16e74',
  featherPen1: 'https://www.figma.com/api/mcp/asset/4d6c5c99-0050-4899-be17-73f47195af6e',
  featherPen2: 'https://www.figma.com/api/mcp/asset/260872fa-8ab4-4193-a059-677b02656b8c',
  project1: 'https://www.figma.com/api/mcp/asset/0155fdb9-55b8-4fc9-b97d-08a48026086b',
  project2: 'https://www.figma.com/api/mcp/asset/26329701-4aad-44fd-8065-712985d6e61c',
  project3: 'https://www.figma.com/api/mcp/asset/8a4f3db5-75c0-4adc-9c7c-36ea627cc840',
  testimonial1: 'https://www.figma.com/api/mcp/asset/85e760fc-decf-498c-925f-13178e258228',
  testimonial2: 'https://www.figma.com/api/mcp/asset/d5b1c1f6-6d11-428e-83c2-43c5e2186692',
  testimonial3: 'https://www.figma.com/api/mcp/asset/528ab1ab-15dd-452e-a436-2ce0658be45c',
  stars: 'https://www.figma.com/api/mcp/asset/965d6b85-8b24-47fe-8db4-e057060259c2',
  facebook: 'https://www.figma.com/api/mcp/asset/183c0738-adb6-4522-8126-eb4b36149542',
  instagram: 'https://www.figma.com/api/mcp/asset/509860c3-bd02-4480-a469-cb6233c8e854',
  twitter: 'https://www.figma.com/api/mcp/asset/0e7a89ee-7e0e-48cf-95ec-6009a74decdc',
  linkedin: 'https://www.figma.com/api/mcp/asset/23ea53ab-4ac3-4652-bbbf-fac2e035414a',
  dribbble: 'https://www.figma.com/api/mcp/asset/1fb2f610-c26b-4891-88ee-1bff1dd06a81',
  arrow: 'https://www.figma.com/api/mcp/asset/deb0af08-f713-48e8-b5c7-b57c75fdccdf',
};

export const LandingPage: React.FC = () => {
  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetInTouch = () => {
    handleContactClick();
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  const services = [
    {
      icon: images.productChain,
      title: 'Strategy & Direction',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
      highlighted: true,
    },
    {
      icon: images.tag,
      title: 'Branding & Logo',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    },
    {
      icon: images.featherPen1,
      title: 'UI & UX Design',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    },
    {
      icon: images.featherPen2,
      title: 'Webflow Development',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    },
  ];

  const projects = [
    {
      image: images.project1,
      title: 'Ahuse',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.',
      linkUrl: '#',
      shadowVariant: 'small' as const,
    },
    {
      image: images.project2,
      title: 'App Dashboard',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.',
      linkUrl: '#',
      shadowVariant: 'medium' as const,
    },
    {
      image: images.project3,
      title: 'Easy Rent',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.',
      linkUrl: '#',
      shadowVariant: 'large' as const,
    },
  ];

  const testimonials = [
    {
      stars: images.stars,
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra.',
      avatar: images.testimonial1,
      name: 'Dianne Russell',
      company: 'Starbucks',
    },
    {
      stars: images.stars,
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra.',
      avatar: images.testimonial2,
      name: 'Kristin Watson',
      company: 'Louis Vuitton',
    },
    {
      stars: images.stars,
      quote:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra.',
      avatar: images.testimonial3,
      name: 'Kathryn Murphy',
      company: "McDonald's",
    },
  ];

  return (
    <div className="bg-white relative w-full">
      <section id="home">
        <Hero
          greeting="Hey, I am John"
          title="I create product design and brand experience"
          highlightedText="product design "
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
          image={images.heroImage}
          onGetInTouch={handleGetInTouch}
        />
      </section>

      <section id="skills" className="flex flex-col gap-12 md:gap-16 lg:gap-20 items-start justify-center py-16 md:py-24 lg:py-36 w-full">
        <Container maxWidth="xl" className="w-full">
          <div className="flex flex-col gap-4 md:gap-5 items-start justify-center w-full mb-8 md:mb-12">
            <SectionTitle
              subtitle="My Skills"
              title="My Expertise"
              align="left"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 items-start w-full">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </Container>
      </section>

      <section id="about">
        <AboutSection
          image={images.aboutMe}
          title="About Me"
          description={[
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius faucibus massa sollicitudin amet augue. Nibh metus a semper purus mauris duis. Lorem eu neque, tristique quis duis. Nibh scelerisque ac adipiscing velit non nulla in amet pellentesque.',
            '',
            'Sit turpis pretium eget maecenas. Vestibulum dolor mattis consectetur eget commodo vitae. Amet pellentesque sit pulvinar lorem mi a, euismod risus r.',
          ]}
        />
      </section>

      <section id="portfolio" className="flex flex-col gap-12 md:gap-16 lg:gap-20 items-start py-16 md:py-24 lg:py-36 w-full">
        <Container maxWidth="xl" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 w-full mb-8 md:mb-12">
            <div className="flex flex-col gap-4 md:gap-5 items-start w-full sm:w-auto">
              <SectionTitle
                subtitle="Recent Projects"
                title="My Portfolio"
                align="left"
              />
            </div>
            <Button variant="social" className="flex items-center gap-2 md:gap-4 text-sm md:text-base">
              <img src={images.dribbble} alt="Dribbble" className="w-6 h-6 md:w-8 md:h-8" />
              Visit My Dribbble
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-start w-full">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </Container>
      </section>

      <section id="testimonials" className="bg-[#f5fcff] flex flex-col gap-12 md:gap-16 lg:gap-20 items-center py-16 md:py-24 lg:py-36 w-full">
        <Container maxWidth="xl" className="w-full">
          <div className="flex flex-col gap-4 md:gap-5 items-start text-[#282938] w-full mb-8 md:mb-12">
            <p className="font-semibold leading-[1.5] text-base md:text-lg">
              Clients Feedback
            </p>
            <p className="font-bold leading-[1.2] text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Customer testimonials
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-start w-full">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </Container>
      </section>

      <section id="contact">
        <ContactForm onSubmit={handleFormSubmit} />
      </section>
    </div>
  );
};

