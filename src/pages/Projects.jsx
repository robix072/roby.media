import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Projects() {
  const { language } = useLanguage();

  const [projects, setProjects] = React.useState([]);

  useEffect(() => {
    document.title = language === 'RO' ? 'Portofoliu | roby.media' : 'Portfolio | roby.media';
    window.scrollTo(0, 0);
    // Fetch from root API for Spaceship
    fetch('/api/projects.php')
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching projects:", err));
  }, [language]);

  const t = {
    title: language === 'RO' ? 'PROIECTELE' : 'OUR',
    subtitle: language === 'RO' ? 'MELE' : 'PROJECTS',
    back: language === 'RO' ? 'ÎNAPOI ACASĂ' : 'BACK HOME'
  };

  return (
    <div className="projects-page app-root" style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', zIndex: 100 }}><Navbar /></div>
      
      <main className="container" style={{ position: 'relative', zIndex: 10, flex: 1, paddingTop: '10rem', paddingBottom: '5rem' }}>
        <h1 className="section-title uppercase text-center" style={{ marginBottom: '4rem' }}>
          {t.title} <span className="live-gradient">{t.subtitle}</span>
        </h1>

        <div className="grid grid-3" style={{ gap: '2.5rem' }}>
          {projects.map((p, idx) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card"
              style={{ padding: '1.5rem', borderRadius: '24px', overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', height: '220px', marginBottom: '1.5rem', overflow: 'hidden', borderRadius: '16px' }}>
                <img 
                  src={p.image_url ? `/${p.image_url}` : '/hero_bg.png'} 
                  alt={p.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>{p.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {p.description}
              </p>
              {p.link && (
                <a href={p.link} target="_blank" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem' }}>
                  VEZI PROIECT <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: '8px' }}></i>
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center" style={{ color: 'rgba(255,255,255,0.4)', padding: '5rem' }}>
            Momentan nu există proiecte adăugate în portofoliu.
          </div>
        )}

        <div className="text-center" style={{ marginTop: '5rem' }}>
          <Link to="/" className="btn-ghost" style={{ fontSize: '0.9rem', opacity: 0.6 }}>
            ← {t.back}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
