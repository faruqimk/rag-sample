import React, { useState, useEffect } from 'react';
import { SymbolData } from '../types';

interface HeaderProps {
  activeSymbol: SymbolData;
  onOpenSearch: () => void;
  onOpenOrderModal: (type: 'BUY' | 'SELL') => void;
  onOpenWalletModal: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSymbol,
  onOpenSearch,
  onOpenOrderModal,
  onOpenWalletModal,
  activeNav,
  setActiveNav,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  // Keyboard shortcut listener for Alt+K or Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'k') || (e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT')) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="bg-[#0f131e] border-b border-[#2a2e39] flex justify-between items-center w-full px-4 md:px-6 h-16 sticky top-0 z-[100] shadow-md">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="material-symbols-outlined text-[#b6c4ff] hover:bg-[#262a35] transition-colors p-2 rounded focus:outline-none"
          title="Toggle Menu"
        >
          menu
        </button>

        <div 
          onClick={() => setActiveNav('Chart')}
          className="text-xl md:text-2xl font-bold text-[#dfe2f2] tracking-tight cursor-pointer flex items-center gap-1 select-none"
        >
          CRYPTO<span className="text-[#2962ff] bg-[#2962ff]/10 px-1.5 py-0.5 rounded text-lg md:text-xl font-black">PRO</span>
        </div>

        {/* Quick Search trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 ml-2 md:ml-4 bg-[#1b1f2b] hover:bg-[#262a35] px-3 py-1.5 rounded border border-[#2a2e39] transition-all cursor-pointer group"
        >
          <span className="material-symbols-outlined text-sm text-[#8d90a2] group-hover:text-[#b6c4ff]">search</span>
          <span className="text-xs font-mono uppercase font-semibold text-[#dfe2f2]">
            {activeSymbol.symbol}
          </span>
          <span className="text-[10px] font-mono bg-[#313441] text-[#8d90a2] px-1.5 py-0.5 rounded ml-2 group-hover:bg-[#2962ff]/20 group-hover:text-[#b6c4ff]">
            ALT+K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden lg:flex items-center gap-1">
          {['Chart', 'Watchlist', 'Ideas', 'Explore', 'Strategy'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`text-xs font-mono font-medium px-3 py-1.5 rounded transition-all ${
                activeNav === item
                  ? 'text-[#b6c4ff] bg-[#262a35] font-semibold border-b-2 border-[#2962ff]'
                  : 'text-[#c3c5d8] hover:text-[#dfe2f2] hover:bg-[#262a35]/60'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenOrderModal('BUY')}
            className="hidden sm:inline-flex bg-[#20a28a] text-[#003027] text-xs font-mono font-bold px-3 py-1.5 rounded hover:bg-[#66dabf] active:scale-95 transition-all shadow-sm"
          >
            BUY
          </button>
          <button
            onClick={() => onOpenOrderModal('SELL')}
            className="hidden sm:inline-flex bg-[#da2237] text-[#fff4f3] text-xs font-mono font-bold px-3 py-1.5 rounded hover:bg-[#ffb3b0] hover:text-[#680010] active:scale-95 transition-all shadow-sm"
          >
            SELL
          </button>

          <button
            onClick={onOpenWalletModal}
            className="bg-[#2962ff] text-[#f7f5ff] text-xs font-mono px-3 md:px-4 py-2 rounded-lg font-bold hover:bg-[#2962ff]/90 active:scale-95 transition-all shadow-lg shadow-[#2962ff]/20 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </header>
  );
};
