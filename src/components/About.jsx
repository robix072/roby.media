import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

/* ── Live VHS static noise canvas ── */
function VHSNoise() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    function draw() {
      const w = canvas.width, h = canvas.height;
      if (w <= 0 || h <= 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v; d[i+1] = v; d[i+2] = v;
        d[i+3] = (Math.random() * 28) | 0;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:4, mixBlendMode:'overlay', borderRadius:'20px' }} />;
}

/* ── Real pixel-slice glitch canvas ── */
function GlitchCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let timeout;

    const img = new window.Image();
    img.src = '/robert.jpg';

    function resize() {
      canvas.width  = canvas.offsetWidth  || 400;
      canvas.height = canvas.offsetHeight || 533;
    }

    function drawGlitchFrame() {
      const w = canvas.width, h = canvas.height;
      if (w <= 0 || h <= 0) return;
      ctx.clearRect(0, 0, w, h);

      // slice the image into random horizontal bands, each shifted
      let y = 0;
      while (y < h) {
        const bh     = 2 + (Math.random() * 28) | 0;
        const shift  = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 38);
        const useRed = Math.random() > 0.65;
        const useCyn = !useRed && Math.random() > 0.5;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, w, bh);
        ctx.clip();
        // draw image slice shifted
        ctx.drawImage(img, shift, 0, w, h);
        // color tint on some bands
        if (useRed) {
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = 'rgba(255,0,80,1)';
          ctx.globalCompositeOperation = 'screen';
          ctx.fillRect(0, y, w, bh);
        } else if (useCyn) {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = 'rgba(0,255,255,1)';
          ctx.globalCompositeOperation = 'screen';
          ctx.fillRect(0, y, w, bh);
        }
        ctx.restore();
        y += bh;
      }
    }

    function runGlitch() {
      if (!img.complete) return;
      resize();
      canvas.style.opacity = '1';
      // fire 3-6 glitch frames at 60fps
      let frames = 3 + ((Math.random() * 4) | 0);
      let f = 0;
      function tick() {
        if (f < frames) {
          drawGlitchFrame();
          f++;
          requestAnimationFrame(tick);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.style.opacity = '0';
          scheduleNext();
        }
      }
      requestAnimationFrame(tick);
    }

    function scheduleNext() {
      const delay = 2500 + Math.random() * 4500;
      timeout = setTimeout(runGlitch, delay);
    }

    img.onload = () => { resize(); scheduleNext(); };
    if (img.complete) { resize(); scheduleNext(); }

    window.addEventListener('resize', resize);
    return () => { clearTimeout(timeout); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 8,
        opacity: 0,
        borderRadius: '20px',
      }}
    />
  );
}

const tools = ['Photoshop', 'Premiere Pro'];

export default function About() {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about__inner">

          {/* Left — photo */}
          <motion.div
            className="about__visual"
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="about__photo-wrap">
              <img
                src="/robert.jpg"
                alt="Robert – roby.media"
                className="about__photo"
              />
              {/* Live noise overlay */}
              <VHSNoise />
              {/* Real pixel-slice glitch canvas */}
              <GlitchCanvas />
              {/* VHS tracking band sweeping top→bottom */}
              <div className="about__vhs-band" />
              {/* REC indicator */}
              <div className="about__rec">
                <span className="about__rec-dot" /> REC
              </div>
            </div>
            <div className="about__avatar-badge">
              <span>🟢</span> {t.avail}
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            className="about__text"
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
          >
            <span className="section-tag">{t.tag}</span>
            <h2 className="section-title uppercase">{t.title1} <span className="live-gradient">{t.title2}</span></h2>

            <div className="about__meta-row">
              <span className="about__meta-pill">🎂 {t.age}</span>
              <span className="about__meta-pill">📍 {t.country}</span>
              <span className="about__meta-pill">🎬 {t.role}</span>
            </div>

            <p className="about__bio" dangerouslySetInnerHTML={{ __html: t.p1.replace('roby.media', "<span style='color: var(--accent); font-weight: 700'>roby.media</span>") }} />
            <p className="about__bio">
              {t.p2}
            </p>

            {/* Mini CV */}
            <div className="about__cv">
              <p className="about__tools-label">{t.exp}</p>
              {t.cv.map((item) => (
                <div key={item.year} className="about__cv-item">
                  <span className="about__cv-year">{item.year}</span>
                  <div>
                    <div className="about__cv-role">{item.role}</div>
                    <div className="about__cv-place">{item.place}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div className="about__tools">
              <p className="about__tools-label">{t.tools}</p>
              <div className="about__tools-grid">
                {tools.map(t => (
                  <span key={t} className="about__tool-tag">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


