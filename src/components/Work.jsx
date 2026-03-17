import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export const projectsMedia = [
  {
    id: 1,
    color: '#7B61FF',
    image: '/clip-intro.mp4',
    isVideo: true,
    year: '2026',
  },
  {
    id: 2,
    color: '#BF5AFF',
    image: '/poza-album-fck.png',
    year: '2025',
  },
  {
    id: 3,
    color: '#5AB4FF',
    image: '/assets-rbt/la virajul trei/v8.mp4',
    isVideo: true,
    year: '2025',
  },
];

export default function Work() {
  const { language } = useLanguage();
  const t = translations[language].work;
  
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % projectsMedia.length);
    }, 4500); // Change every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  const media = projectsMedia[index];
  const project = t.projects[index];

  const variants = {
    enter: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(20px) brightness(3)',
      x: 0,
    },
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px) brightness(1)',
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      scale: 1.05,
      filter: 'blur(20px) brightness(0)',
      x: 0,
      transition: {
        duration: 0.3
      }
    },
  };

  // Add a glitch overlay effect variant
  const glitchVariants = {
    initial: { opacity: 0, x: 0 },
    animate: {
      opacity: [0, 0.4, 0, 0.2, 0],
      x: [0, -20, 20, -10, 0],
      transition: {
        duration: 0.4,
        ease: "linear",
      }
    }
  };

  return (
    <section className="work section" id="work" style={{ position: 'relative', overflow: 'hidden' }}>
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

      <div className="work__bg-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${media.color}10, transparent 70%)`, position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title uppercase">{t.title1} <span className="live-gradient">{t.title2}</span></h2>
          <p className="section-sub">{t.sub}</p>
        </div>

        <div className="work__showcase">
          <div className="work__presentation-wrap">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="work__featured-card"
              >
                {/* Glitch Overlay Effect */}
                <motion.div 
                  className="work__glitch-overlay"
                  variants={glitchVariants}
                  initial="initial"
                  animate="animate"
                  key={`glitch-${index}`}
                />

                  <div className="work__card-inner glass-card">
                  <div className="work__card-img-wrap">
                    {media.isVideo ? (
                      <video 
                        key={`${index}-${Math.random()}`}
                        src={media.images ? media.images[Math.floor(Math.random() * media.images.length)] : media.image} 
                        className="work__card-img" 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        onLoadedMetadata={(e) => {
                          const randomStart = media.id === 1 ? Math.floor(Math.random() * 20) : 0;
                          e.target.currentTime = randomStart;
                        }}
                      />
                    ) : (
                      <img src={media.image} alt={project.title} className="work__card-img" />
                    )}
                    <div className="work__card-overlay" style={{ background: `linear-gradient(to bottom, transparent, ${media.color}15)` }} />
                    <div className="work__card-badge" style={{ backgroundColor: media.color }}>
                      {project.category}
                    </div>
                  </div>

                  <div className="work__card-content">
                    <div className="work__project-info">
                        <div className="work__info-item">
                            <span className="label">{t.year}</span>
                            <span className="value">{media.year}</span>
                        </div>
                        <div className="work__info-item">
                            <span className="label">{t.client}</span>
                            <span className="value">{project.client}</span>
                        </div>
                    </div>

                    <h3 className="work__featured-title">{project.title}</h3>
                    <p className="work__featured-desc">{project.desc}</p>
                    
                    <div className="work__card-footer">
                      <button className="work__cta-btn" style={{ '--btn-color': media.color }}>
                        <span className="btn-text">{t.explore}</span>
                        <div className="btn-icon">→</div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="work__presentation-footer">
              {/* Progress bar for auto-play */}
              <div className="work__auto-progress">
                <motion.div 
                  key={index}
                  className="work__auto-progress-fill" 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                  style={{ backgroundColor: media.color }}
                />
              </div>

              <Link to="/projects" className="work__view-all-btn">
                <span>{t.viewAll}</span>
                <div className="btn-arrow">↗</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
