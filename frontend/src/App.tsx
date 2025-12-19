import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

const images = {
  logo: 'https://www.figma.com/api/mcp/asset/2d613df7-1149-428e-a2f5-8f1fe969b468',
  facebook: 'https://www.figma.com/api/mcp/asset/183c0738-adb6-4522-8126-eb4b36149542',
  instagram: 'https://www.figma.com/api/mcp/asset/509860c3-bd02-4480-a469-cb6233c8e854',
  twitter: 'https://www.figma.com/api/mcp/asset/0e7a89ee-7e0e-48cf-95ec-6009a74decdc',
  linkedin: 'https://www.figma.com/api/mcp/asset/23ea53ab-4ac3-4652-bbbf-fac2e035414a',
};

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isBlogPage = location.pathname.startsWith('/blog');

  const handleContactClick = () => {
    if (isHomePage) {
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  };

  const menuItems = [
    { label: 'Home', href: '/', active: location.pathname === '/' },
    { label: 'Portfolio', href: isHomePage ? '#portfolio' : '/#portfolio' },
    { label: 'About me', href: isHomePage ? '#about' : '/#about' },
    { label: 'Blogs', href: '/blog', active: isBlogPage },
    { label: 'Testimonials', href: isHomePage ? '#testimonials' : '/#testimonials' },
  ];

  const socialIcons = [
    { name: 'Facebook', icon: images.facebook, url: '#' },
    { name: 'Instagram', icon: images.instagram, url: '#' },
    { name: 'Twitter', icon: images.twitter, url: '#' },
    { name: 'LinkedIn', icon: images.linkedin, url: '#' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        logo={images.logo}
        onContactClick={handleContactClick}
        menuItems={menuItems}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
        </Routes>
      </main>
      <Footer
        logo={images.logo}
        menuItems={[
          { label: 'Home', href: '/#home' },
          { label: 'Portfolio', href: '/#portfolio' },
          { label: 'About me', href: '/#about' },
          { label: 'Blogs', href: '/blog' },
          { label: 'Contact', href: '/#contact' },
          { label: 'Testimonials', href: '/#testimonials' },
        ]}
        socialIcons={socialIcons}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
