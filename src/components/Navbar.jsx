import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].navbar;
  
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: t.about, href: '#about' },
    { label: t.work, href: '#work' },
    { label: t.skills, href: '#skills' },
    { label: t.social, href: '#social' },
    { label: t.contact, href: '#contact' },
  ];

  useEffect(() => {
    const container = document.getElementById('snap-root') || window;
    const onScroll = () => {
      const scrollTop = container === window ? window.scrollY : container.scrollTop;
      setScrolled(scrollTop > 40);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setOpen(false); // Close mobile menu if open
    
    // If not on the homepage, route contextually
    if (location.pathname !== '/') {
      navigate('/' + id);
      // It will auto-scroll/jump via standard hash jumping, or we can handle it on mount.
      // For simple SPA with smooth scroll we let React Router push the state and let the browser anchor jump.
      return;
    }

    const container = document.getElementById('snap-root') || window;
    const target = document.getElementById(id.replace('#', ''));
    if (target) {
      if (container === window) {
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      } else {
        container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}
    >
      <div className="navbar__inner container" style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: '40px' }}>
        <motion.a 
          href="/" 
          className="navbar__logo" 
          onClick={(e) => {
            if (location.pathname === '/') {
              scrollToSection(e, 'hero');
            } else {
              e.preventDefault();
              navigate('/');
            }
          }}
          initial={false}
          animate={{ 
            left: scrolled ? '50%' : '6vw',
            x: scrolled ? '-50%' : '0%' 
          }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', zIndex: 10, margin: 0 }}
        >
          <img src="/logo.png" alt="roby.media logo" style={{ height: '40px', objectFit: 'contain' }} />
        </motion.a>

        <AnimatePresence>
          {!scrolled && (
            <motion.div 
              className="navbar__right"
              initial={{ opacity: 0, width: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, width: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, width: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', marginLeft: 'auto', whiteSpace: 'nowrap', gap: '1.5rem' }}
            >
              <ul className="navbar__links" style={{ margin: 0 }}>
                {navLinks.map(link => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="navbar__link"
                      onClick={(e) => scrollToSection(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a 
                  href="#contact" 
                  className="btn-primary navbar__cta"
                  onClick={(e) => scrollToSection(e, '#contact')}
                >
                  {language === 'RO' ? 'Hai să discutăm' : "Let's Talk"}
                </a>
                
                <button 
                  onClick={toggleLanguage} 
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    color: '#fff', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  {language === 'RO' ? 'EN' : 'RO'}
                </button>
              </div>

              <button className="navbar__burger" onClick={() => setOpen(!open)} aria-label="menu">
                <span className={open ? 'bar bar--top open' : 'bar bar--top'} />
                <span className={open ? 'bar bar--mid open' : 'bar bar--mid'} />
                <span className={open ? 'bar bar--bot open' : 'bar bar--bot'} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            {navLinks.map(link => (
              <a 
                key={link.label} 
                href={link.href} 
                className="navbar__mobile-link" 
                onClick={(e) => scrollToSection(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a 
              href="#contact" 
              className="btn-primary" 
              style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }} 
              onClick={(e) => scrollToSection(e, '#contact')}
            >
              {language === 'RO' ? 'Hai să discutăm' : "Let's Talk"}
            </a>
            <button 
              onClick={() => { toggleLanguage(); setOpen(false); }} 
              className="btn-ghost"
              style={{ marginTop: '1rem', width: '100%' }}
            >
               Switch to {language === 'RO' ? 'English' : 'Romanian'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
