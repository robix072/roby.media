import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { projectsMedia } from '../components/Work';

export default function Projects() {
  const { language } = useLanguage();
  const t = translations[language].projectsPage;
  const projects = translations[language].work.projects;

  useEffect(() => {
    // Set Page Title
    document.title = language === 'RO' ? 'Toate Proiectele | roby.media' : 'All Projects | roby.media';
    
    // Ensure we start at the top
    window.scrollTo(0, 0);
    const container = document.getElementById('snap-root');
    if (container) container.scrollTo(0, 0);
  }, [language]);

  return (
    <div className="projects-page app-root" style={{ overflowY: 'auto', background: 'var(--bg)', position: 'relative' }}>
      {/* Background Video styled like hero */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.1, mixBlendMode: 'screen', pointerEvents: 'none' }}>
        <video 
          src="/BG%202.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.3) brightness(1.2) sepia(100%) hue-rotate(220deg) saturate(150%)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 20%, transparent 80%, var(--bg) 100%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
      </div>
      
      <main className="container" style={{ paddingTop: '10rem', paddingBottom: '8rem', minHeight: '100vh' }}>
        <motion.div 
          className="section-header center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">{translations[language].work.tag}</span>
          <h1 className="section-title uppercase">
            {t.title1} <span className="live-gradient">{t.title2}</span>
          </h1>
          <p className="section-sub">{t.sub}</p>
        </motion.div>

        <div className="services__grid" style={{ marginTop: '4rem' }}>
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ overflow: 'hidden', padding: 0 }}
            >
              <div style={{ height: '240px', width: '100%', position: 'relative', background: '#000' }}>
                {projectsMedia[idx]?.isVideo ? (
                  <video 
                    src={projectsMedia[idx].image} 
                    autoPlay loop muted playsInline 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img 
                    src={projectsMedia[idx]?.image || 'https://via.placeholder.com/600x400'} 
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                   <span className="work__card-badge">{project.category}</span>
                </div>
              </div>
              
              <div style={{ padding: '2rem' }}>
                <h3 className="work__featured-title" style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>{project.title}</h3>
                <p className="work__featured-desc" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', opacity: 0.6 }}>{project.desc}</p>
                <div className="work__project-info" style={{ gap: '1.5rem' }}>
                   <div className="work__info-item">
                      <span className="label">{translations[language].work.client}</span>
                      <span className="value">{project.client}</span>
                   </div>
                   <div className="work__info-item">
                      <span className="label">2026</span>
                      <span className="value">Project</span>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          style={{ marginTop: '6rem', textAlign: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link to="/" className="btn-ghost">
            ← {t.back}
          </Link>
        </motion.div>
      </main>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </div>
  );
}
