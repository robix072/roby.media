import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Contact() {
  const { language } = useLanguage();
  const t = translations[language].contact;

  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' });
  const [sent, setSent] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title uppercase">{t.title1} <span className="live-gradient">{t.title2}</span></h2>
          <p className="section-sub">{t.sub}</p>
        </motion.div>

        <div className="contact__inner">
          {/* Info cards */}
          <motion.div
            className="contact__info"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {[
              { icon: '✉', label: t.infoBox.email, val: 'contact@roby.media' },
              { icon: '💬', label: t.infoBox.discord, val: 'robycrs' },
              { icon: '📍', label: t.infoBox.location, val: language === 'RO' ? 'București, România' : 'Bucharest, Romania' },
              { icon: '⚡', label: t.infoBox.response, val: 'ASAP' },
            ].map(i => (
              <div className="contact__info-card glass-card" key={i.label}>
                <span className="contact__info-icon">{i.icon}</span>
                <div>
                  <p className="contact__info-label">{i.label}</p>
                  <p className="contact__info-val">{i.val}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            className="contact__form glass-card"
            onSubmit={submit}
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {sent ? (
              <div className="contact__success">
                <span className="contact__success-icon">✓</span>
                <h3>{t.form.successTitle}</h3>
                <p>{t.form.successDesc}</p>
              </div>
            ) : (
              <>
                <div className="contact__row">
                  <div className="contact__field">
                    <label>{t.form.name}</label>
                    <input name="name" value={form.name} onChange={handle} placeholder={t.form.namePlaceholder} required />
                  </div>
                  <div className="contact__field">
                    <label>{t.form.email}</label>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder={t.form.emailPlaceholder} required />
                  </div>
                </div>
                <div className="contact__field">
                  <label>{t.form.project}</label>
                  <select name="project" value={form.project} onChange={handle} required>
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
                  <textarea name="message" rows={4} value={form.message} onChange={handle} placeholder={t.form.messagePlaceholder} required />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', fontStyle: 'uppercase', fontWeight: 900 }}>
                  {t.form.send}
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
