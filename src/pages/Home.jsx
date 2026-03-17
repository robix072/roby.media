import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Work from '../components/Work';
import About from '../components/About';
import Skills from '../components/Skills';
import Social from '../components/Social';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = language === 'RO' ? 'roby.media | Producție Video & Design' : 'roby.media | Video Production & Design';
  }, [language]);
  return (
    <div className="app-root">
      <Navbar />
      <div className="snap-container" id="snap-root">
        <Hero />
        <About />
        <Work />
        <Skills />
        <Social />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
