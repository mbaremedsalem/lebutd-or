// src/components/Header.jsx
import { Link } from 'react-router-dom';
import { CircleDot, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png'; // ← Import de l'image

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLang = i18n.language || 'fr';
  const isRTL = currentLang === 'ar';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className="sticky top-0 z-40 bg-pitch text-chalk shadow-lg shadow-black/20"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        
        {/* Logo et nom */}
        <Link 
          to="/" 
          className={`focus-ring flex items-center gap-2 rounded transition-opacity hover:opacity-80 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className="relative h-10 w-10 flex-shrink-0">
            <img 
              src={logo} 
              alt="Logo Le But d'Or" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement.querySelector('.fallback-icon');
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <CircleDot 
              className="fallback-icon h-10 w-10 text-floodlight absolute top-0 left-0" 
              strokeWidth={2.5}
              style={{ display: 'none' }}
            />
          </div>
          <span className={`font-display text-2xl font-semibold tracking-widest ${isRTL ? 'text-right' : ''}`}>
            {t('header.brand')}
            <span className="text-floodlight">{t('header.brandAccent')}</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className={`hidden gap-8 text-sm font-medium uppercase tracking-wider text-chalk/80 sm:flex ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link 
            to="/" 
            className="focus-ring rounded px-2 py-1 hover:text-floodlight transition-colors"
          >
            {t('header.navHalls')}
          </Link>
          <a 
            href="#offres" 
            className="focus-ring rounded px-2 py-1 hover:text-floodlight transition-colors"
          >
            {t('header.navOffers')}
          </a>
        </nav>

        {/* Language Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            aria-label="Changer la langue"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase font-medium">{currentLang}</span>
          </button>

          {isOpen && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-40 rounded-md bg-pitch-dark shadow-lg border border-white/10 overflow-hidden`}>
              <button
                onClick={() => changeLanguage('fr')}
                className={`w-full px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                  currentLang === 'fr' 
                    ? 'text-floodlight bg-white/5' 
                    : 'text-chalk/80'
                } ${isRTL ? 'text-right' : 'text-left'}`}
              >
                🇫🇷 Français
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`w-full px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                  currentLang === 'ar' 
                    ? 'text-floodlight bg-white/5' 
                    : 'text-chalk/80'
                } ${isRTL ? 'text-right' : 'text-left'}`}
              >
                🇸🇦 العربية
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}