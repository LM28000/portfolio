import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';
import { trackPortfolioEvent } from '../utils/analytics';

const Contact = () => {
  const { t } = useLanguage();
  const titleAnimation = useScrollAnimation({ delay: 200 });
  const contactCardsAnimation = useStaggeredAnimation(4, 200);
  const formAnimation = useScrollAnimation({ delay: 600 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mode test pour développement
      const testMode = import.meta.env.VITE_TEST_MODE === 'true';
      
      if (testMode) {
        // Simulation d'envoi en mode test
        console.log('📧 Mode test - Email simulé:', {
          de: formData.name,
          email: formData.email,
          sujet: formData.subject,
          message: formData.message
        });
        
        // Simulation d'un délai d'envoi
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
        
        return;
      }

      // Configuration EmailJS réelle
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(t('contact.form.error.config'));
      }

      // Paramètres du template
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Louis-Marie Perret du Cray',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      // Track successful form submission
      trackPortfolioEvent.contactFormSubmit();
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Retour au formulaire après 5 secondes
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      if (error instanceof Error && error.message === t('contact.form.error.config')) {
        setError(t('contact.form.error.config'));
      } else {
        setError(t('contact.form.error.send'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.email.label'),
      value: "louis-marie@du-cray.com",
      href: "mailto:louis-marie@du-cray.com",
      color: "blue"
    },
    {
      icon: Phone,
      label: t('contact.phone.label'),
      value: "+33 6 19 86 22 97",
      href: "tel:+33619862297",
      color: "green"
    },
    {
      icon: MapPin,
      label: t('contact.location.label'),
      value: "Levallois-Perret (92) & Nantes (44)",
      href: "#",
      color: "orange"
    },
    {
      icon: Linkedin,
      label: t('contact.linkedin.label'),
      value: "louismarie-perret-du-cray",
      href: "https://www.linkedin.com/in/louismarie-perret-du-cray",
      color: "blue"
    }
  ];

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.success.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('contact.success.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${titleAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div 
            ref={contactCardsAnimation.ref}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('contact.coordinates')}</h3>
            
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              };

              return (
                <a
                  key={index}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-xl transition-all duration-300 group border border-gray-200 dark:border-gray-700 hover-lift-gentle hover-glow hover-shadow-blue-dark stagger-item ${contactCardsAnimation.isItemVisible(index) ? 'visible' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    colorClasses[contact.color as keyof typeof colorClasses]
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white transition-colors">
                      {contact.label}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">{contact.value}</p>
                  </div>
                </a>
              );
            })}

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('contact.availability.title')}</h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('contact.availability.description')}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div 
            ref={formAnimation.ref}
            className={`bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover-shadow-blue-dark scroll-slide-right ${formAnimation.isVisible ? 'visible' : ''}`}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('contact.form.title')}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('contact.form.name.placeholder')}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('contact.form.email.placeholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('contact.form.subject.placeholder')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('contact.form.message.placeholder')}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl btn-primary ${
                  isLoading 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {t('contact.send')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;