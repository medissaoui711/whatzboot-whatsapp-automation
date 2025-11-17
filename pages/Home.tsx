import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Footer from '../components/Footer';
import PublicHeader from '../components/PublicHeader';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add a staggered delay for a nicer effect
            setTimeout(() => {
              entry.target.classList.remove('opacity-0', 'translate-y-4');
              entry.target.classList.add('opacity-100', 'translate-y-0');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureCards = featuresRef.current?.querySelectorAll('.feature-card');
    if (featureCards) {
      featureCards.forEach((card) => observer.observe(card));
    }

    return () => {
      if (featureCards) {
        featureCards.forEach((card) => observer.unobserve(card));
      }
    };
  }, []);


  const features = [
    { icon: 'fa-robot', title: t('home.feature_autobot_title'), description: t('home.feature_autobot_desc') },
    { icon: 'fa-bullhorn', title: t('home.feature_broadcast_title'), description: t('home.feature_broadcast_desc') },
    { icon: 'fa-chart-line', title: t('home.feature_analytics_title'), description: t('home.feature_analytics_desc') },
    { icon: 'fa-wrench', title: t('home.feature_tools_title'), description: t('home.feature_tools_desc') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-center py-20 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-dark-bg [background-image:radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,211,102,0.05),rgba(255,255,255,0))]"></div>
          <div className="container mx-auto px-6">
             <i className="fa-brands fa-whatsapp text-7xl text-whatsapp-green mb-6"></i>
            <h1 className="text-4xl lg:text-6xl font-bold text-dark-text-primary max-w-4xl mx-auto leading-tight">
              {t('home.hero_title')}
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-dark-text-secondary max-w-3xl mx-auto">
              {t('home.hero_subtitle')}
            </p>
            <Link to="/dashboard">
              <Button className="mt-10 px-8 py-4 text-lg group">
                {t('home.cta_button')}
                <i className="fa-solid fa-arrow-right ms-2 transition-transform duration-300 group-hover:translate-x-1"></i>
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-dark-card">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-dark-text-primary mb-12">
              {t('home.features_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="feature-card text-center !bg-dark-bg opacity-0 transform translate-y-4 transition-all duration-500 ease-out">
                  <div className="mx-auto mb-6 flex items-center justify-center h-16 w-16 rounded-full bg-whatsapp-green/10 text-whatsapp-green">
                    <i className={`fa-solid ${feature.icon} text-3xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-dark-text-primary mb-3">{feature.title}</h3>
                  <p className="text-dark-text-secondary">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;