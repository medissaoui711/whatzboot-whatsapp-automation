
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const Footer: React.FC = () => {
  const [showScroll, setShowScroll] = useState(false);
  const { t, dir } = useLanguage();

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    
    const handleScroll = () => {
      if (mainContent) {
        if (mainContent.scrollTop > 300) {
          setShowScroll(true);
        } else {
          setShowScroll(false);
        }
      }
    };

    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => {
        mainContent.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollTop = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pagesLinks = [
    { name: t("footer.home"), path: "/dashboard" },
    { name: t("footer.about_us"), path: "/about" },
    { name: t("footer.features"), path: "/features" },
    { name: t("footer.pricing"), path: "/pricing" },
    { name: t("footer.faq"), path: "/faq" },
    { name: t("footer.how_it_works"), path: "/how-it-works" },
    { name: t("footer.contact_us"), path: "/contact" }
  ];
  const companyLinks = [
    { name: t("footer.our_mission"), path: "/mission" },
    { name: t("footer.careers"), path: "/careers" },
    { name: t("footer.privacy_policy"), path: "/privacy" },
    { name: t("footer.terms_of_service"), path: "/terms" },
    { name: t("footer.ai_terms"), path: "/ai-terms" },
    { name: t("footer.press_kit"), path: "/press" },
    { name: t("footer.blog"), path: "/blog" }
  ];
  const socialLinks = [
    { platform: 'LinkedIn', icon: 'fa-linkedin', link: 'https://www.linkedin.com/company/whatzboot' },
    { platform: 'Facebook', icon: 'fa-facebook', link: 'https://www.facebook.com/whatzboot' },
    { platform: 'Instagram', icon: 'fa-instagram', link: 'https://www.instagram.com/whatzboot' },
    { platform: 'X (Twitter)', icon: 'fa-twitter', link: 'https://x.com/whatzboot' },
  ];

  const linkClasses = "hover:text-whatsapp-green transition-colors duration-200 text-gray-400 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-whatsapp-green";
  const socialLinkClasses = "text-gray-400 hover:text-white transform hover:scale-110 hover:drop-shadow-[0_0_8px_#25D366] transition-all duration-300 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-whatsapp-green";

  const textAlignmentClass = dir === 'rtl' ? 'md:text-right' : 'md:text-left';
  const socialAlignmentClass = dir === 'rtl' ? 'md:justify-start' : 'md:justify-end';

  return (
    <>
      <footer className="bg-gradient-to-b from-[#0D1117] to-[#161B22] text-gray-300 relative rounded-t-2xl shadow-inner">
        <div className="h-1 bg-gradient-to-r from-whatsapp-green to-whatsapp-blue rounded-t-2xl"></div>
        <div className="container mx-auto px-6 py-12">
          {/* Branding Section */}
          <div className="mb-12 text-center">
            <Link to="/dashboard" className="text-2xl font-bold text-white mb-2 inline-flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-whatsapp-green">
              <i className="fa-brands fa-whatsapp me-2 text-whatsapp-green text-3xl"></i>
              {t('whatzboot')}
            </Link>
            <p className="text-sm text-gray-400 mt-2">{t('footer.tagline')}</p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 text-center ${textAlignmentClass}`}>
            {/* Pages Section */}
            <div>
                <h3 className="font-semibold text-white tracking-wider uppercase mb-4">{t('footer.pages_title')}</h3>
                <ul className="space-y-2">
                    {pagesLinks.map(link => (
                    <li key={link.name}>
                        <Link to={link.path} className={linkClasses}>{link.name}</Link>
                    </li>
                    ))}
                </ul>
            </div>

            {/* Company Section */}
            <div>
                <h3 className="font-semibold text-white tracking-wider uppercase mb-4">{t('footer.company_title')}</h3>
                <ul className="space-y-2">
                    {companyLinks.map(link => (
                    <li key={link.name}>
                        <Link to={link.path} className={linkClasses}>{link.name}</Link>
                    </li>
                    ))}
                </ul>
            </div>

            {/* Social Connections */}
            <div className={`text-center ${dir === 'rtl' ? 'md:text-left' : 'md:text-right'}`}>
                <h3 className="font-semibold text-white tracking-wider uppercase mb-4">{t('footer.social_title')}</h3>
                <div className={`flex space-x-5 rtl:space-x-reverse mt-4 justify-center ${socialAlignmentClass}`}>
                    {socialLinks.map(social => (
                    <a key={social.platform} href={social.link} target="_blank" rel="noopener noreferrer" aria-label={social.platform} className={socialLinkClasses}>
                        <i className={`fa-brands ${social.icon} text-3xl`}></i>
                    </a>
                    ))}
                </div>
            </div>
          </div>


          <div className="mt-12 border-t border-gray-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            <div className="flex items-center mt-4 sm:mt-0">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="ms-2">{t('footer.ai_status')}</span>
            </div>
          </div>
        </div>
      </footer>
      {showScroll && (
        <button
          onClick={scrollTop}
          className={`fixed bottom-10 z-50 bg-whatsapp-green text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-whatsapp-teal-green transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-whatsapp-green ${dir === 'rtl' ? 'left-10' : 'right-10'}`}
          aria-label={t('footer.scroll_top')}
        >
          <i className="fa-solid fa-arrow-up text-xl"></i>
        </button>
      )}
    </>
  );
};

export default Footer;