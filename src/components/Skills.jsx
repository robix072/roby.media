import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Skills() {
  const { language } = useLanguage();
  const t = translations[language].skills;

  return (
    <section className="services section" id="skills">
      <div className="container">
        <motion.div
          className="section-header center"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title uppercase">{t.title1} <span className="live-gradient">{t.title2}</span></h2>
          <p className="section-sub">{t.sub}</p>
        </motion.div>

        <div className="services__grid">
          {t.services.map((s, i) => {
            const colors = ["#7B61FF", "#5AB4FF", "#BF5AFF", "#FF5A5A", "#5AFFBF", "#FFBF5A"];
            const icons = ['🎬', '📈', '🎨', '⚡', '🎥', '🤝'];
            const id = (i + 1).toString().padStart(2, '0');
            const isCTA = i === t.services.length - 1;
            const color = colors[i] || "#7B61FF";

            return (
              <motion.div 
                className="services__card-box" 
                key={id}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ '--card-color': color }}
              >
                <div className="services__card-v2 glass-card">
                  <div className="services__card-top">
                    {!isCTA && <span className="services__card-id" style={{ color: color }}>{id}</span>}
                    <div className="services__card-icon">{icons[i]}</div>
                  </div>
                  <h3 className="services__card-title">{s.title}</h3>
                  <p className="services__card-desc">{s.desc}</p>
                  
                  {isCTA ? (
                    <div className="services__card-cta">
                      <a 
                        href="#contact" 
                        className="s-cta-btn" 
                        style={{ background: color }}
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById('contact');
                          const container = document.getElementById('snap-root') || window;
                          if (target) {
                            container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                          }
                        }}
                      >
                        {t.contactBtn}
                      </a>
                    </div>
                  ) : (
                    <div className="services__card-tags">
                      {s.tags.slice(0, 2).map(tag => <span key={tag} className="s-tag">{tag}</span>)}
                    </div>
                  )}
                  
                  <div className="services__card-border-glow" style={{ background: `linear-gradient(45deg, transparent, ${color}40, transparent)` }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
