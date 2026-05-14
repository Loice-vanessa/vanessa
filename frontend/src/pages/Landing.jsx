import { useEffect } from 'react';
import NavBar          from './landing/NavBar';
import Hero            from './landing/Hero';
import StatsBar        from './landing/StatsBar';
import Features        from './landing/Features';
import HowItWorks      from './landing/HowItWorks';
import DoctorsSection  from './landing/DoctorsSection';
import RoleSplit       from './landing/RoleSplit';
import FAQ             from './landing/FAQ';
import CTA             from './landing/CTA';
import Footer          from './landing/Footer';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Landing() {
  useReveal();
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <NavBar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <DoctorsSection />
      <RoleSplit />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
