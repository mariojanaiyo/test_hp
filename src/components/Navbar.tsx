import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenContact: (prefillNote?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'サービス', href: '#services' },
    { label: '制作実績', href: '#works' },
    { label: 'プロセス', href: '#process' },
    { label: '料金プラン', href: '#pricing' },
    { label: 'よくある質問', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-neutral-900/90 backdrop-blur-md text-white border-b border-neutral-800 shadow-sm'
          : 'bg-white/90 backdrop-blur-md text-neutral-900 border-b border-neutral-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight uppercase flex items-center gap-2 group transition-transform active:scale-95"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white group-hover:scale-125 transition-transform" />
          <span className="font-extrabold tracking-wider">KOUBOU</span>
        </a>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors py-1 ${
                isScrolled
                  ? 'text-neutral-300 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => onOpenContact()}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer shadow-sm ${
              isScrolled
                ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            <span>無料相談・お見積り</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 focus:outline-none"
            aria-label="メニューを開く"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 text-white border-b border-neutral-800 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-300 hover:text-white py-1.5 border-b border-neutral-800/60"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-3 bg-white text-neutral-950 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-100"
            >
              <span>無料相談・お見積り</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
