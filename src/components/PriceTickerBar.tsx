import React, { useEffect, useState } from 'react';
import { SymbolData } from '../types';

interface PriceTickerBarProps {
  symbolData: SymbolData;
  onOpenOrderModal: (type: 'BUY' | 'SELL') => void;
  onOpenSearchModal: () => void;
}

export const PriceTickerBar: React.FC<PriceTickerBarProps> = ({
  symbolData,
  onOpenOrderModal,
  onOpenSearchModal,
}) => {
  const [flashClass, setFlashClass] = useState<'flash-up' | 'flash-down' | ''>('');
  const [prevPrice, setPrevPrice] = useState<number>(symbolData.price);

  useEffect(() => {
    if (symbolData.price > prevPrice) {
      setFlashClass('flash-up');
    } else if (symbolData.price < prevPrice) {
      setFlashClass('flash-down');
    }
    setPrevPrice(symbolData.price);

    const timer = setTimeout(() => setFlashClass(''), 600);
    return () => clearTimeout(timer);
  }, [symbolData.price, prevPrice]);

  const isPositive = symbolData.change24hPct >= 0;

  return (
    <div className={`bg-[#131722] border-b border-[#2a2e39] px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 transition-colors ${flashClass}`}>
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={onOpenSearchModal}
          className="flex items-center gap-2 group text-left cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-lg md:text-xl font-bold text-[#dfe2f2] group-hover:text-[#b6c4ff]">
            {symbolData.name}
          </span>
          <span className="text-xs font-mono text-[#868993] bg-[#1b1f2b] px-2 py-0.5 rounded border border-[#2a2e39]">
            {symbolData.exchange}
          </span>
        </button>

        <div className="flex items-center gap-3 border-l border-[#2a2e39] pl-4">
          <span className={`text-xl md:text-2xl font-mono font-bold ${isPositive ? 'text-[#66dabf]' : 'text-[#ffb4ab]'}`}>
            {symbolData.price.toLocaleString(undefined, {
              minimumFractionDigits: symbolData.precision,
              maximumFractionDigits: symbolData.precision,
            })}
          </span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            isPositive ? 'bg-[#20a28a]/20 text-[#66dabf]' : 'bg-[#da2237]/20 text-[#ffb4ab]'
          }`}>
            {isPositive ? '+' : ''}{symbolData.change24h.toFixed(symbolData.precision)} ({isPositive ? '+' : ''}{symbolData.change24hPct.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono overflow-x-auto custom-scrollbar py-1">
        <div className="flex gap-4 border-l border-[#2a2e39] pl-4 text-nowrap">
          <div className="flex flex-col">
            <span className="text-[#868993] text-[10px]">OPEN</span>
            <span className="text-[#dfe2f2] font-semibold">{symbolData.open24h.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#868993] text-[10px]">HIGH</span>
            <span className="text-[#dfe2f2] font-semibold">{symbolData.high24h.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#868993] text-[10px]">LOW</span>
            <span className="text-[#dfe2f2] font-semibold">{symbolData.low24h.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#868993] text-[10px]">CLOSE</span>
            <span className="text-[#dfe2f2] font-semibold">{symbolData.close24h.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#868993] text-[10px]">24H VOL</span>
            <span className="text-[#dfe2f2] font-semibold">{symbolData.volume24h}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onOpenOrderModal('BUY')}
            className="bg-[#20a28a] hover:bg-[#66dabf] text-[#003027] text-xs font-mono font-bold px-4 py-1.5 rounded uppercase tracking-wider active:scale-95 transition-all shadow-md"
          >
            BUY
          </button>
          <button
            onClick={() => onOpenOrderModal('SELL')}
            className="bg-[#da2237] hover:bg-[#ffb3b0] hover:text-[#680010] text-[#fff4f3] text-xs font-mono font-bold px-4 py-1.5 rounded uppercase tracking-wider active:scale-95 transition-all shadow-md"
          >
            SELL
          </button>
        </div>
      </div>
    </div>
  );
};
