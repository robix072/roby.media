import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Contact() {
  const { language } = useLanguage();
  const t = translations[language].contact;

  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' });
  const [sent, setSent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  const contactInfo = [
    { icon: '✉', label: t.infoBox.email, val: 'contact@roby.media' },
    { icon: '💬', label: t.infoBox.discord, val: 'robycrs' },
    { icon: '📍', label: t.infoBox.location, val: language === 'RO' ? 'București' : 'Bucharest' },
    { icon: '⚡', label: t.infoBox.response, val: 'ASAP' },
  ];

  const tickerItems = [...contactInfo, ...contactInfo, ...contactInfo];

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title uppercase">{t.title1} <span className="live-gradient">{t.title2}</span></h2>
        </motion.div>

        <div className="contact__inner">
          {/* Contact Info area */}
          {isMobile ? (
            <div className="contact__ticker-wrapper">
              <motion.div 
                className="contact__ticker-track"
                animate={{ x: ["0%", "-33.33%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                {tickerItems.map((i, idx) => (
                  <div className="contact__info-card ticker-item" key={idx}>
                    <span className="contact__info-icon">{i.icon}</span>
                    <div className="contact__info-text">
                      <p className="contact__info-label">{i.label}</p>
                      <p className="contact__info-val">{i.val}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="contact__info">
              {contactInfo.map((i, idx) => (
                <div className="contact__info-card glass-card" key={idx}>
                  <span className="contact__info-icon">{i.icon}</span>
                  <div>
                    <p className="contact__info-label">{i.label}</p>
                    <p className="contact__info-val">{i.val}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form area */}
          <div className="contact__form-container">
            {sent ? (
              <div className="contact__success glass-card">
                <span className="contact__success-icon">✓</span>
                <h3>{t.form.successTitle}</h3>
                <p>{t.form.successDesc}</p>
              </div>
            ) : (
              <motion.form
                className="contact__form glass-card"
                onSubmit={handleSubmit}
                initial={isMobile ? { opacity: 1 } : { x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="contact__row">
                  <div className="contact__field">
                    <label>{t.form.name}</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder={t.form.namePlaceholder} required />
                  </div>
                  <div className="contact__field">
                    <label>{t.form.email}</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder={t.form.emailPlaceholder} required />
                  </div>
                </div>
                <div className="contact__field">
                  <label>{t.form.project}</label>
                  <select name="project" value={form.project} onChange={handleChange} required>
                    <option value="">{t.form.projectSelect}</option>
                    {language === 'RO' ? (
                      <>
                        <option>Editare Video & Post-Producție</option>
                        <option>Marketing & Strategie Vizuală</option>
                        <option>Graphic Design & Branding</option>
                        <option>Content Creation Management</option>
                        <option>Producție Video & Regie</option>
                        <option>Altceva / Cerere Specială</option>
                      </>
                    ) : (
                      <>
                        <option>Video Editing & Post-Production</option>
                        <option>Marketing & Visual Strategy</option>
                        <option>Graphic Design & Branding</option>
                        <option>Content Creation Management</option>
                        <option>Video Production & Directing</option>
                        <option>Something Else / Special Request</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="contact__field">
                  <label>{t.form.message}</label>
                  <textarea name="message" rows={isMobile ? 2 : 4} value={form.message} onChange={handleChange} placeholder={t.form.messagePlaceholder} required />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', textTransform: 'uppercase', fontWeight: 900 }}>
                  {t.form.send}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
