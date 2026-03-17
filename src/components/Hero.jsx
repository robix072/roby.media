import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

function AnimatedWords() {
  const { language } = useLanguage();
  const WORDS = translations[language].hero.words;
  
  const [text, setText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [loopNum, setLoopNum] = React.useState(0);

  React.useEffect(() => {
    let timer;
    const i = loopNum % WORDS.length;
    const fullText = WORDS[i];

    const handleTyping = () => {
      setText(prev => 
        isDeleting 
          ? fullText.substring(0, prev.length - 1) 
          : fullText.substring(0, prev.length + 1)
      );
    };

    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopNum(prev => prev + 1);
    } else {
      timer = setTimeout(handleTyping, isDeleting ? 30 : 70);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, WORDS]);

  return (
    <span className="gradient-text" aria-live="polite" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        style={{ color: 'var(--accent)', marginLeft: '4px', display: 'inline-block', fontWeight: '400' }}
      >
        |
      </motion.span>
    </span>
  );
}

const containerVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};
const itemVar = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const VIDEOS = [
  '/assets-rbt/v2.mp4',
  '/assets-rbt/v3.mp4',
  '/assets-rbt/credit fulger 10.mp4',
  '/assets-rbt/miss 10.mp4'
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [currentVideo, setCurrentVideo] = React.useState(0);

  const { language } = useLanguage();
  const t = translations[language].hero;

  React.useEffect(() => {
    setCurrentVideo(Math.floor(Math.random() * VIDEOS.length));
  }, []);

  const handleVideoEnd = () => {
    setCurrentVideo(prev => (prev + 1) % VIDEOS.length);
  };

  return (
    <section className="hero" id="hero" ref={ref}>
      {/* Parallax BG Video */}
      <motion.div className="hero__bg" style={{ y: bgY }}>
        <video 
          src="/BG%202.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="hero__bg-video"
          onContextMenu={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
        />
        <div className="hero__bg-overlay" />
      </motion.div>

      {/* Floating orbs */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      {/* Fixed Phone Mockup (moved outside of animated content for stability) */}
      <div className="hero__fixed-right">
        <motion.div 
          className="phone-mockup"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div className="phone-mockup__notch"></div>
          <div className="phone-mockup__bg"></div>
          <video 
            key={VIDEOS[currentVideo]}
            className="phone-mockup__video" 
            autoPlay 
            muted 
            playsInline
            onEnded={handleVideoEnd}
            src={VIDEOS[currentVideo]} 
            onContextMenu={e => e.preventDefault()}
            onDragStart={e => e.preventDefault()}
          />
        </motion.div>
      </div>

      <motion.div
        className="hero__content container"
        style={{ opacity }}
        variants={containerVar}
        initial="hidden"
        animate="visible"
      >
        <div className="hero__layout">
          <div className="hero__left">
            <motion.div variants={itemVar} style={{ marginBottom: '1.5rem' }}>
              <span className="section-tag" style={{ fontFamily: "'Outfit', sans-serif" }}>{t.tag}</span>
            </motion.div>

            <motion.div variants={itemVar} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>
              <span style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                {t.intro}
              </span>
              
              <h1 className="hero__title" style={{ margin: '0' }}>
                <AnimatedWords />
              </h1>
              
              <span style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.5rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginTop: '0.5rem' }}>
                {t.outro}
              </span>
            </motion.div>

            <motion.p className="hero__subtitle" variants={itemVar}>
              {t.subtitle}
            </motion.p>

            <motion.div className="hero__actions" variants={itemVar}>
              <a href="#work" className="btn-primary">{t.btnWork}</a>
              <a href="#contact" className="btn-ghost">{t.btnContact}</a>
            </motion.div>

            <motion.div className="hero__stats" variants={itemVar}>
              {[
                { n: '50+', l: t.stats.projects },
                { n: '3+', l: t.stats.years },
                { n: '30+', l: t.stats.clients },
                { n: '∞', l: t.stats.passion },
              ].map(s => (
                <div key={s.l} className="hero__stat">
                  <span className="hero__stat-num">{s.n}</span>
                  <span className="hero__stat-label">{s.l}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
        <span>{t.scroll}</span>
      </motion.div>
    </section>
  );
}
