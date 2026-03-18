import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Projects() {
  const { language } = useLanguage();

  useEffect(() => {
    // Set Page Title
    document.title = language === 'RO' ? 'Toate Proiectele | roby.media' : 'All Projects | roby.media';
    
    // Ensure we start at the top
    window.scrollTo(0, 0);
  }, [language]);

  const t = {
    title: language === 'RO' ? 'PORTOFOLIU COMPLET' : 'FULL PORTFOLIO',
    comingSoon: language === 'RO' ? 'COMING SOON' : 'COMING SOON',
    message: language === 'RO' 
        ? 'Momentan încă lucrăm la această secțiune pentru a vă oferi cea mai bună experiență.' 
        : 'We are currently working on this section to provide you with the best experience.',
    cta: language === 'RO'
        ? 'Te invit să-mi scrii pe Instagram pentru a vedea mai multe proiecte sau pentru detalii.'
        : 'I invite you to message me on Instagram to see more projects or for details.',
    back: language === 'RO' ? 'ÎNAPOI ACASĂ' : 'BACK HOME'
  };

  return (
    <div className="projects-page app-root" style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background Video styled like hero */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.9, mixBlendMode: 'screen', pointerEvents: 'none' }}>
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

      <div style={{ position: 'relative', zIndex: 100 }}>
        <Navbar />
      </div>
      
      <main className="container" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ 
            maxWidth: '800px', 
            width: '100%', 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            borderRadius: '40px',
            border: '1px solid rgba(123, 97, 255, 0.2)',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(30px)'
          }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="section-tag" style={{ marginBottom: '1.5rem' }}>{t.comingSoon}</span>
            <h1 className="section-title uppercase" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              {t.title.split(' ')[0]} <br /> <span className="live-gradient">{t.title.split(' ')[1]}</span>
            </h1>
            <p className="section-sub" style={{ fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', marginInline: 'auto' }}>
              {t.message}
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
               <p style={{ fontSize: '1rem', color: '#fff', marginBottom: '1.5rem', opacity: 0.9 }}>
                 {t.cta}
               </p>
               <a 
                 href="https://instagram.com/robycrs" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="btn-primary" 
                 style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
               >
                 <i className="fa-brands fa-instagram" style={{ marginRight: '10px' }}></i>
                 @ROBYCRS
               </a>
            </div>

            <Link to="/" className="btn-ghost" style={{ fontSize: '0.9rem', opacity: 0.6 }}>
              ← {t.back}
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Footer />
      </div>
    </div>
  );
}
