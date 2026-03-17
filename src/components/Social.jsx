import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Social() {
  const { language } = useLanguage();
  const t = translations[language].social;

  return (
    <section className="social section" id="social" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Video styled like hero */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.15, mixBlendMode: 'screen', pointerEvents: 'none' }}>
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

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="social__grid">
          {/* Left Side: Video Preview */}
          <motion.div 
            className="social__video-column"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="social__video-header">
              <span className="social__latest-tag">{t.latest}</span>
            </div>
            <div className="social__video-wrapper glass-card">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/hASy6ZkcEE8?start=275" 
                title="RobyCRS - O zi din viața unui artist" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
              <div className="social__video-glow" />
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            className="social__content-column"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-tag">{t.tag}</span>
            <h2 className="social__title uppercase">
              {t.title1} <span className="live-gradient">{t.title2}</span>
            </h2>
            <p className="social__desc" dangerouslySetInnerHTML={{ __html: t.desc.replace('roby.media', '<strong>roby.media</strong>') }} />

            <div className="social__links">
              <a href="https://youtube.com/@robycrs" target="_blank" rel="noopener noreferrer" className="social__link-btn youtube">
                <span className="icon"><i className="fa-brands fa-youtube"></i></span>
                <div className="label">
                  <span>YouTube</span>
                  <small>@robycrs</small>
                </div>
              </a>
              <a href="https://instagram.com/robycrs" target="_blank" rel="noopener noreferrer" className="social__link-btn instagram">
                <span className="icon"><i className="fa-brands fa-instagram"></i></span>
                <div className="label">
                  <span>Instagram</span>
                  <small>@robycrs</small>
                </div>
              </a>
              <a href="https://tiktok.com/@robycrs" target="_blank" rel="noopener noreferrer" className="social__link-btn tiktok">
                <span className="icon"><i className="fa-brands fa-tiktok"></i></span>
                <div className="label">
                  <span>TikTok</span>
                  <small>@robycrs</small>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
