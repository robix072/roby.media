import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Skills() {
  const { language } = useLanguage();
  const t = translations[language].skills;

  const [index, setIndex] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  React.useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % t.services.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isMobile, t.services.length]);

  const handleDragEnd = (event, info) => {
    if (!isMobile) return;
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setIndex((prev) => (prev + 1) % t.services.length);
    } else if (info.offset.x > swipeThreshold) {
      setIndex((prev) => (prev - 1 + t.services.length) % t.services.length);
    }
  };

  const colors = ["#7B61FF", "#5AB4FF", "#BF5AFF", "#FF5A5A", "#5AFFBF", "#FFBF5A"];
  const icons = ['🎬', '📈', '🎨', '⚡', '🎥', '🤝'];

  const renderCard = (s, i) => {
    const id = (i + 1).toString().padStart(2, '0');
    const isCTA = i === t.services.length - 1;
    const color = colors[i] || "#7B61FF";

    return (
      <motion.div 
        className="services__card-box" 
        key={i}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ '--card-color': color, width: '100%' }}
      >
        <div className={`services__card-v2 glass-card ${isCTA ? 'is-cta-card' : ''}`}>
          <div className={`services__card-top ${isCTA ? 'is-cta' : ''}`}>
            {!isCTA && <span className="services__card-id" style={{ color: color }}>{id}</span>}
            <div className="services__card-icon">{icons[i]}</div>
          </div>
          <h3 className="services__card-title">{s.title}</h3>
          <p className="services__card-desc">{s.desc}</p>
          
          {isCTA ? (
            <div className="services__card-cta">
              <a href="#contact" className="s-cta-btn" style={{ background: color }}>{t.contactBtn}</a>
            </div>
          ) : (
            <div className="services__card-tags" style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '1.2rem' }}>
              {s.tags.slice(0, 2).map(tag => <span key={tag} className="s-tag">{tag}</span>)}
            </div>
          )}
          <div className="services__card-border-glow" style={{ background: `linear-gradient(45deg, transparent, ${color}40, transparent)` }} />
        </div>
      </motion.div>
    );
  };

  return (
    <section className="services section" id="skills">
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title uppercase">{t.title1} <span className="live-gradient">{t.title2}</span></h2>
          <p className="section-sub">{t.sub}</p>
        </motion.div>

        <div className="services__grid">
          {isMobile ? (
            <div className="services__mobile-carousel">
              <AnimatePresence mode="wait">
                {renderCard(t.services[index], index)}
              </AnimatePresence>
              
              <div className="services__progress-container">
                <div className="services__progress-track">
                  <motion.div 
                    key={index}
                    className="services__progress-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    style={{ backgroundColor: colors[index] }}
                  />
                </div>
              </div>
            </div>
          ) : (
            t.services.map((s, i) => renderCard(s, i))
          )}
        </div>
      </div>
    </section>
  );
}
