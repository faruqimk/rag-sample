import React, { useState, useEffect } from 'react';
import { SymbolData } from '../types';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: SymbolData[];
  onSelectSymbol: (symbol: SymbolData) => void;
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'crypto' | 'stocks' | 'forex'>('all');

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = symbols.filter((s) => {
    const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesSearch =
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-[#131722] border border-[#2a2e39] rounded-xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2a2e39] flex items-center gap-3 bg-[#0f131e]">
          <span className="material-symbols-outlined text-[#8d90a2]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crypto, stock, forex symbols (e.g. BTCUSD, AAPL)..."
            className="flex-1 bg-transparent border-none text-white text-sm font-mono focus:outline-none uppercase"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-[#8d90a2] hover:text-white text-xs font-mono px-2 py-1 bg-[#262a35] rounded"
          >
            ESC
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 p-3 bg-[#171b26] border-b border-[#2a2e39] text-xs font-mono">
          {[
            { id: 'all', label: 'All Symbols' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'forex', label: 'Forex' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-3 py-1 rounded transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#2962ff] text-white font-bold'
                  : 'text-[#868993] hover:text-[#dfe2f2] hover:bg-[#262a35]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Symbols List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#868993] font-mono text-xs">
              No symbols found matching "{searchQuery}"
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => {
                const isPos = item.change24hPct >= 0;
                return (
                  <div
                    key={item.symbol}
                    onClick={() => {
                      onSelectSymbol(item);
                      onClose();
                    }}
                    className="p-3 rounded-lg bg-[#171b26] hover:bg-[#262a35] border border-transparent hover:border-[#2a2e39] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#262a35] flex items-center justify-center text-[#b6c4ff] font-mono font-bold text-xs">
                        {item.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <div className="font-bold font-mono text-sm text-white">{item.symbol}</div>
                        <div className="text-xs text-[#868993]">{item.name}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="font-bold text-white">${item.price.toLocaleString()}</div>
                      <div className={isPos ? 'text-[#66dabf]' : 'text-[#ffb4ab]'}>
                        {isPos ? '+' : ''}{item.change24hPct.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
