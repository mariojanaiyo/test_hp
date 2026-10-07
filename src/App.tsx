/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Works } from './components/Works';
import { Process } from './components/Process';
import { PricingCalculator } from './components/PricingCalculator';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';

export default function App() {
  const [prefillNote, setPrefillNote] = useState<string>('');
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const handleOpenContact = (note?: string) => {
    if (note) {
      setPrefillNote(note);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Content Area */}
      <main className="flex-1">
        <Hero onOpenContact={handleOpenContact} />
        <Services onOpenContact={handleOpenContact} />
        <Works onOpenContact={handleOpenContact} />
        <Process />
        <PricingCalculator onOpenContact={handleOpenContact} />
        <Testimonials />
        <FaqSection />
        <ContactSection
          initialPrefillNote={prefillNote}
          onClearPrefill={() => setPrefillNote('')}
        />
      </main>

      {/* Quiet Footer */}
      <Footer onOpenLegal={(type) => setLegalModalType(type)} />

      {/* Legal & Policy Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
