import React, { useState } from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { SectionTitle } from '../SectionTitle';
import { Container } from '../Container';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  acceptTerms: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    acceptTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const topicOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'project', label: 'Project Discussion' },
    { value: 'collaboration', label: 'Collaboration' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <section className={`flex flex-col gap-12 md:gap-16 lg:gap-20 items-center justify-center py-16 md:py-24 lg:py-36 ${className}`}>
      <Container maxWidth="xl" className="w-full">
        <div className="flex flex-col gap-4 md:gap-5 items-center w-full max-w-3xl mx-auto">
          <SectionTitle
            subtitle="Get In Touch"
            title="Contact me"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            align="center"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 md:gap-8 items-center w-full max-w-3xl mx-auto mt-8 md:mt-12"
        >
        <div className="flex gap-8 items-start w-full">
          <Input
            label="First name"
            type="text"
            value={formData.firstName}
            onChange={(value) => setFormData({ ...formData, firstName: value })}
            className="flex-1"
          />
          <Input
            label="Last name"
            type="text"
            value={formData.lastName}
            onChange={(value) => setFormData({ ...formData, lastName: value })}
            className="flex-1"
          />
        </div>
        <div className="flex gap-8 items-start w-full">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            className="flex-1"
          />
          <Input
            label="Phone number"
            type="tel"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            className="flex-1"
          />
        </div>
        <Input
          label="Choose a topic"
          type="select"
          placeholder="Select one..."
          value={formData.topic}
          onChange={(value) => setFormData({ ...formData, topic: value })}
          options={topicOptions}
        />
        <Input
          label="Message"
          type="textarea"
          placeholder="Type your message..."
          value={formData.message}
          onChange={(value) => setFormData({ ...formData, message: value })}
          rows={10}
        />
        <div className="flex gap-2.5 items-center w-full">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) =>
              setFormData({ ...formData, acceptTerms: e.target.checked })
            }
            className="bg-white border border-[#282938] rounded w-[21.333px] h-[21.333px]"
          />
          <label
            htmlFor="acceptTerms"
            className="font-normal leading-[1.5] text-base text-[#282938]"
          >
            I accept the terms
          </label>
        </div>
        <Button type="submit" variant="primary" className="w-full sm:w-auto min-w-[170px]">
          Submit
        </Button>
      </form>
      </Container>
    </section>
  );
};

