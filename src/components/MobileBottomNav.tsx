import React from 'react';

interface MobileBottomNavProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenSearch: () => void;
  onOpenWallet: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeNav,
  setActiveNav,
  onOpenSearch,
  onOpenWallet,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe h-14 bg-[#0f131e] border-t border-[#2a2e39] text-[10px] font-mono shadow-2xl">
      <button
        onClick={() => setActiveNav('Watchlist')}
        className={`flex flex-col items-center justify-center transition-colors ${
          activeNav === 'Watchlist' ? 'text-[#2962ff] font-bold' : 'text-[#868993]'
        }`}
      >
        <span className="material-symbols-outlined text-lg">view_list</span>
        <span>Watchlist</span>
      </button>

      <button
        onClick={() => setActiveNav('Chart')}
        className={`flex flex-col items-center justify-center transition-colors ${
          activeNav === 'Chart' ? 'text-[#2962ff] font-bold' : 'text-[#868993]'
        }`}
      >
        <span className="material-symbols-outlined text-lg">show_chart</span>
        <span>Chart</span>
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center text-[#868993] hover:text-white"
      >
        <span className="material-symbols-outlined text-lg">search</span>
        <span>Search</span>
      </button>

      <button
        onClick={() => setActiveNav('Ideas')}
        className={`flex flex-col items-center justify-center transition-colors ${
          activeNav === 'Ideas' ? 'text-[#2962ff] font-bold' : 'text-[#868993]'
        }`}
      >
        <span className="material-symbols-outlined text-lg">lightbulb</span>
        <span>Ideas</span>
      </button>

      <button
        onClick={onOpenWallet}
        className="flex flex-col items-center justify-center text-[#868993] hover:text-white"
      >
        <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
        <span>Account</span>
      </button>
    </nav>
  );
};
