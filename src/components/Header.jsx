// Header.jsx
import { Link } from 'react-router-dom';
import { CircleDot, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLang = i18n.language;
  const isRTL = currentLang === 'ar';

  return (
    <header 
      className={`sticky top-0 z-40 bg-pitch text-chalk shadow-lg shadow-black/20 ${
        isRTL ? 'rtl' : ''
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="focus-ring flex items-center gap-2 rounded">
          <CircleDot className="h-7 w-7 text-floodlight" strokeWidth={2.5} />
          <span className="font-display text-2xl font-semibold tracking-widest">
            {t('header.brand')}
            <span className="text-floodlight">{t('header.brandAccent')}</span>
          </span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium uppercase tracking-wider text-chalk/80 sm:flex">
          <Link to="/" className="focus-ring rounded hover:text-floodlight">
            {t('header.navHalls')}
          </Link>
          <a href="#offres" className="focus-ring rounded hover:text-floodlight">
            {t('header.navOffers')}
          </a>
        </nav>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase">{currentLang}</span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-32 rounded-md bg-pitch-dark shadow-lg border border-white/10 overflow-hidden">
              <button
                onClick={() => changeLanguage('fr')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                  currentLang === 'fr' ? 'text-floodlight bg-white/5' : 'text-chalk/80'
                }`}
              >
                Français
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                  currentLang === 'ar' ? 'text-floodlight bg-white/5' : 'text-chalk/80'
                }`}
              >
                 العربية
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}