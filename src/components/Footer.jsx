import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;

  const handleLogoClick = (e) => {
    e.preventDefault();
    const container = document.getElementById('snap-root') || window;
    const hero = document.getElementById('hero');
    if (hero) {
      container.scrollTo({ top: hero.offsetTop, behavior: 'smooth' });
    } else {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Desktop Layout remains consistent via CSS, Mobile gets reorganized */}
        <div className="footer__top-row">
          <div className="footer__left">
            <a href="/" className="footer__logo-v2" onClick={handleLogoClick}>
              <img src="/logo.png" alt="roby.media logo" style={{ height: '35px', objectFit: 'contain' }} />
            </a>
          </div>

          <div className="footer__social-v2">
            <a href="https://instagram.com/roby.media" target="_blank" rel="noopener noreferrer" className="footer__social-btn">
              <i className="fa-brands fa-instagram"></i>
              <span className="footer__social-name">INSTAGRAM</span>
            </a>
            <a href="https://tiktok.com/@roby.media" target="_blank" rel="noopener noreferrer" className="footer__social-btn">
              <i className="fa-brands fa-tiktok"></i>
              <span className="footer__social-name">TIKTOK</span>
            </a>
            <a href="mailto:contact@roby.media" className="footer__social-btn">
              <i className="fa-regular fa-envelope"></i>
              <span className="footer__social-name">EMAIL</span>
            </a>
          </div>
        </div>

        <div className="footer__bottom-row mobile-only">
           <p className="footer__rights-text">{t.rights}</p>
        </div>
      </div>

      <div className="footer__bar desktop-only">
        <p>{t.rights}</p>
      </div>
    </footer>
  );
}
