import { useEffect, useState } from 'react';

import HoisstStyles from './components/HoisstStyles.jsx';
import LeadFormModal from './components/LeadFormModal.jsx';

import Welcome from './components/sections/Welcome.jsx';
import Nav from './components/sections/Nav.jsx';
import Hero from './components/sections/Hero.jsx';
import ProofBar from './components/sections/ProofBar.jsx';
import Testimonials from './components/sections/Testimonials.jsx';
import Badges from './components/sections/Badges.jsx';
import FeatureReplace from './components/sections/FeatureReplace.jsx';
import FeatureTax from './components/sections/FeatureTax.jsx';
import CtaStrip from './components/sections/CtaStrip.jsx';
import Bullets from './components/sections/Bullets.jsx';
import Steps from './components/sections/Steps.jsx';
import Guarantee from './components/sections/Guarantee.jsx';
import CaseFile from './components/sections/CaseFile.jsx';
import Faq from './components/sections/Faq.jsx';
import FinalCta from './components/sections/FinalCta.jsx';
import Footer from './components/sections/Footer.jsx';


/* ============================================================================
 * HOISST LANDING PAGE  ·  composition root
 * ----------------------------------------------------------------------------
 * The page is now assembled from one component per section (each renders the
 * original markup verbatim) plus the shared design stylesheet. Nothing visual
 * changed: the rendered output is identical to the single-file version.
 *
 * The only new behaviour: every primary CTA (.cta-3d in the hero / strip /
 * final, and .nav-cta in the header) opens the LeadFormModal pop-up instead of
 * navigating. One delegated click handler on the wrapper does this, so the
 * section markup stays untouched and the booking URL remains a no-JS fallback.
 * Drop a real booking URL / lead endpoint in the constants below.
 * ========================================================================== */

const BOOKING_URL = '{{SCOPE_CALL_BOOKING_URL}}'; // no-JS fallback already in the markup
const LEAD_ENDPOINT = 'https://getnos.io/hossit/index.php';

export default function HoisstLanding() {
  const [formOpen, setFormOpen] = useState(false);

  /* ---- WELCOME-BAR OPT-IN CONTINUITY (unchanged from the original) ---- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = (params.get('name') || '').trim().slice(0, 40);
    const email = (params.get('email') || '').trim().slice(0, 80);

    if (name || email) {
      const welcome = document.getElementById('welcome');
      const wcName = document.getElementById('wcName');
      const wcEmail = document.getElementById('wcEmail');
      if (name && wcName) wcName.textContent = name;
      if (email && wcEmail) wcEmail.textContent = email;
      if (welcome) welcome.classList.add('show');
    }

    const dismiss = document.getElementById('wcDismiss');
    const handleDismiss = () => {
      const w = document.getElementById('welcome');
      if (w) w.classList.remove('show');
    };
    if (dismiss) dismiss.addEventListener('click', handleDismiss);
    return () => { if (dismiss) dismiss.removeEventListener('click', handleDismiss); };
  }, []);

  /* ---- open the pop-up from any primary CTA (delegated, design untouched) ---- */
  const handleClick = (e) => {
    const trigger = e.target.closest('a.cta-3d, a.nav-cta');
    if (trigger) {
      e.preventDefault();
      setFormOpen(true);
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <HoisstStyles />

      <div className="hoisst-lp" onClick={handleClick}>
        <Welcome />
        <Nav />
        <Hero />
        <ProofBar />
        <Testimonials />
        <Badges />
        <FeatureReplace />
        <FeatureTax />
        <CtaStrip />
        <Bullets />
        <Steps />
        <Guarantee />
        <CaseFile />
        <Faq />
        <FinalCta />
        <Footer />
    
      </div>

      <LeadFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        bookingUrl={BOOKING_URL}
        endpoint={LEAD_ENDPOINT}
      />
    </>
  );
}
