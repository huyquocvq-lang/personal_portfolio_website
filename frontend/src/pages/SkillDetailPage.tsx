import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { skillApi, RelatedProject } from '../services/api';
import { Container } from '../components/Container';
import { ProjectCard } from '../components/ProjectCard';
import { SectionTitle } from '../components/SectionTitle';

export const SkillDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const language = (searchParams.get('lang') || 'vi') as 'vi' | 'en';

  useEffect(() => {
    if (slug) {
      loadSkill();
    }
  }, [slug, language]);

  const loadSkill = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const skillData = await skillApi.getSkillBySlug(slug, language);
      setSkill(skillData);
    } catch (err) {
      setError('Failed to load skill');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSwitch = (lang: 'vi' | 'en') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', lang);
    setSearchParams(newParams);
  };

  // Helper function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container maxWidth="xl" className="w-full">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container maxWidth="xl" className="w-full">
          <div className="text-center py-12">
            <p className="text-red-600">{error || 'Skill not found'}</p>
            <Link to="/" className="text-purple-600 hover:underline mt-4 inline-block">
              Back to Home
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container maxWidth="xl" className="w-full">
        <Link
          to="/"
          className="text-purple-600 hover:text-purple-700 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {skill.icon_url && (
                  <div className="bg-white flex gap-3 md:gap-3.5 items-center justify-center p-3 md:p-3.5 rounded-lg md:rounded-xl shadow-[0px_0px_16px_0px_rgba(0,0,0,0.1)]">
                    <div className="relative shrink-0 w-12 h-12 md:w-[53.333px] md:h-[53.333px]">
                      <img
                        src={skill.icon_url}
                        alt={skill.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {skill.highlighted && (
                  <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageSwitch('vi')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'vi'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => handleLanguageSwitch('en')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'en'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {skill.title}
            </h1>

            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {skill.description}
              </p>
            </div>

            {skill.related_projects && skill.related_projects.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="mb-8">
                  <SectionTitle
                    subtitle="Related Projects"
                    title="Projects using this skill"
                    align="left"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                  {skill.related_projects.map((project: RelatedProject) => (
                    <ProjectCard
                      key={project.id}
                      image={project.image_url || ''}
                      title={project.title}
                      description={project.description}
                      linkUrl={project.link_url || '#'}
                      shadowVariant="small"
                    />
                  ))}
                </div>
              </div>
            )}

            {(!skill.related_projects || skill.related_projects.length === 0) && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-center py-8">
                  No related projects available at the moment.
                </p>
              </div>
            )}
          </div>
        </article>
      </Container>
    </div>
  );
};

