import React, { useState } from 'react';
import { SymbolData, NewsItem } from '../types';

interface RightPanelProps {
  symbols: SymbolData[];
  activeSymbol: SymbolData;
  onSelectSymbol: (symbol: SymbolData) => void;
  onToggleFavorite: (symbolName: string) => void;
  newsItems: NewsItem[];
}

export const RightPanel: React.FC<RightPanelProps> = ({
  symbols,
  activeSymbol,
  onSelectSymbol,
  onToggleFavorite,
  newsItems,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'crypto' | 'stocks' | 'forex' | 'fav'>('all');

  const filteredSymbols = symbols.filter((s) => {
    if (filterCategory === 'crypto') return s.category === 'crypto';
    if (filterCategory === 'stocks') return s.category === 'stocks';
    if (filterCategory === 'forex') return s.category === 'forex';
    if (filterCategory === 'fav') return s.isFavorite;
    return true;
  });

  return (
    <aside className="hidden lg:flex flex-col w-72 border-l border-[#2a2e39] bg-[#171b26] shrink-0 z-20">
      {/* Watchlist Header */}
      <div className="p-4 border-b border-[#2a2e39] flex justify-between items-center bg-[#0f131e]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#dfe2f2]">
            Watchlist
          </span>
          <span className="bg-[#262a35] text-[#b6c4ff] text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
            {filteredSymbols.length}
          </span>
        </div>
        <button className="material-symbols-outlined text-[#8d90a2] hover:text-white transition-colors text-lg cursor-pointer">
          settings
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-[#2a2e39] px-2 py-1.5 bg-[#131722] gap-1 overflow-x-auto custom-scrollbar">
        {[
          { id: 'all', label: 'ALL' },
          { id: 'fav', label: '★ FAV' },
          { id: 'crypto', label: 'CRYPTO' },
          { id: 'stocks', label: 'STOCKS' },
          { id: 'forex', label: 'FOREX' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id as any)}
            className={`text-[10px] font-mono px-2 py-1 rounded transition-all whitespace-nowrap cursor-pointer ${
              filterCategory === tab.id
                ? 'bg-[#2962ff] text-white font-bold'
                : 'text-[#868993] hover:text-[#dfe2f2] hover:bg-[#262a35]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Watchlist Table */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="text-[10px] font-mono text-[#868993] uppercase sticky top-0 bg-[#171b26] border-b border-[#2a2e39] z-10">
            <tr>
              <th className="p-2.5 pl-3 font-medium">Symbol</th>
              <th className="p-2.5 font-medium text-right">Last</th>
              <th className="p-2.5 pr-3 font-medium text-right">Chg%</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {filteredSymbols.map((item) => {
              const isSelected = item.symbol === activeSymbol.symbol;
              const isPos = item.change24hPct >= 0;

              return (
                <tr
                  key={item.symbol}
                  onClick={() => onSelectSymbol(item)}
                  className={`cursor-pointer border-b border-[#2a2e39]/50 transition-colors group ${
                    isSelected
                      ? 'bg-[#262a35] border-l-2 border-l-[#2962ff]'
                      : 'hover:bg-[#1b1f2b]'
                  }`}
                >
                  <td className="p-2.5 pl-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.symbol);
                        }}
                        className={`text-xs ${
                          item.isFavorite ? 'text-[#ffb3b0]' : 'text-[#434656] group-hover:text-[#8d90a2]'
                        }`}
                      >
                        ★
                      </button>
                      <div className="flex flex-col">
                        <span className={`font-bold ${isSelected ? 'text-[#b6c4ff]' : 'text-[#dfe2f2]'}`}>
                          {item.symbol}
                        </span>
                        <span className="text-[9px] text-[#868993] uppercase">
                          {item.exchange.split('•')[0]}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-2.5 text-right font-semibold text-[#dfe2f2]">
                    {item.price.toLocaleString(undefined, {
                      minimumFractionDigits: item.precision,
                      maximumFractionDigits: item.precision,
                    })}
                  </td>
                  <td className={`p-2.5 pr-3 text-right font-bold ${isPos ? 'text-[#66dabf]' : 'text-[#ffb4ab]'}`}>
                    {isPos ? '+' : ''}{item.change24hPct.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Live Feed / News Section */}
      <div className="p-4 border-t border-[#2a2e39] bg-[#0a0e19] h-64 overflow-y-auto custom-scrollbar shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[11px] font-mono font-bold text-[#8d90a2] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#20a28a] animate-pulse"></span>
            <span>Live Market Feed</span>
          </h4>
          <span className="text-[10px] font-mono text-[#868993]">Real-time</span>
        </div>

        <div className="space-y-3">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="p-2.5 rounded bg-[#131722] border border-[#2a2e39] hover:border-[#434656] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[9px] font-mono text-[#868993] mb-1">
                <span className={`font-bold px-1.5 py-0.2 rounded ${
                  news.sentiment === 'BULLISH'
                    ? 'bg-[#20a28a]/20 text-[#66dabf]'
                    : news.sentiment === 'BEARISH'
                    ? 'bg-[#da2237]/20 text-[#ffb4ab]'
                    : 'bg-[#262a35] text-white'
                }`}>
                  {news.category}
                </span>
                <span>{news.timeAgo}</span>
              </div>
              <h5 className="text-[11px] font-medium text-[#dfe2f2] group-hover:text-[#b6c4ff] leading-tight">
                {news.title}
              </h5>
              <div className="text-[9px] font-mono text-[#868993] mt-1 text-right">
                Via {news.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
