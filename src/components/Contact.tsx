import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "louis-marie@du-cray.com",
      href: "mailto:louis-marie@du-cray.com",
      color: "blue"
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+33 6 19 86 22 97",
      href: "tel:+33619862297",
      color: "green"
    },
    {
      icon: MapPin,
      label: "Localisation",
      value: "Levallois-Perret (92)",
      href: "#",
      color: "orange"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "louis-marie-perret-du-cray",
      href: "https://www.linkedin.com/in/louis-marie-perret-du-cray",
      color: "blue"
    }
  ];

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl p-12 shadow-lg">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Message envoyé !</h3>
              <p className="text-gray-600">
                Merci pour votre message. Je vous répondrai dans les plus brefs délais.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Une question, un projet ou simplement envie d'échanger ? N'hésitez pas à me contacter !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Mes coordonnées</h3>
            
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              const colorClasses = {
                blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
                green: "bg-green-100 text-green-600 hover:bg-green-200",
                orange: "bg-orange-100 text-orange-600 hover:bg-orange-200"
              };

              return (
                <a
                  key={index}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                    colorClasses[contact.color as keyof typeof colorClasses]
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {contact.label}
                    </p>
                    <p className="text-gray-600">{contact.value}</p>
                  </div>
                </a>
              );
            })}

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Disponibilité</h4>
              <p className="text-gray-600">
                Actuellement en alternance chez Devoteam. Disponible pour des discussions 
                sur des projets innovants, des collaborations ou des opportunités futures.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-moi un message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Send size={20} />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;