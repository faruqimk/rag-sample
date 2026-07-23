import React from 'react';
import { IndicatorState } from '../types';

interface IndicatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicators: IndicatorState;
  setIndicators: React.Dispatch<React.SetStateAction<IndicatorState>>;
}

export const IndicatorsModal: React.FC<IndicatorsModalProps> = ({
  isOpen,
  onClose,
  indicators,
  setIndicators,
}) => {
  if (!isOpen) return null;

  const toggleIndicator = (key: keyof IndicatorState) => {
    setIndicators((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const list: { key: keyof IndicatorState; label: string; category: string; desc: string }[] = [
    { key: 'sma20', label: 'Simple Moving Average (20)', category: 'Moving Averages', desc: 'Short-term trend smoothing filter' },
    { key: 'sma50', label: 'Simple Moving Average (50)', category: 'Moving Averages', desc: 'Medium-term support and resistance trend' },
    { key: 'bollinger', label: 'Bollinger Bands (20, 2)', category: 'Volatility', desc: 'Price volatility envelope & breakout bands' },
    { key: 'rsi', label: 'Relative Strength Index (14)', category: 'Oscillators', desc: 'Momentum oscillator measuring speed and momentum' },
    { key: 'volume', label: 'Volume Histogram', category: 'Volume', desc: 'Trading activity volume bars per candle' },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131722] border border-[#2a2e39] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-[#2a2e39] flex justify-between items-center bg-[#0f131e]">
          <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff]">monitoring</span>
            <span>Indicators & Technical Overlay</span>
          </h3>
          <button onClick={onClose} className="text-[#8d90a2] hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3 font-mono text-xs max-h-[60vh] overflow-y-auto custom-scrollbar">
          {list.map((item) => {
            const isEnabled = indicators[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleIndicator(item.key)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isEnabled
                    ? 'bg-[#2962ff]/15 border-[#2962ff] text-white'
                    : 'bg-[#171b26] border-[#2a2e39] text-[#c3c5d8] hover:border-[#434656]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.label}</span>
                    <span className="text-[9px] bg-[#262a35] text-[#868993] px-1.5 py-0.2 rounded uppercase">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#868993] mt-1">{item.desc}</div>
                </div>

                <div
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                    isEnabled ? 'bg-[#2962ff]' : 'bg-[#262a35]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#2a2e39] bg-[#0f131e] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#2962ff] text-white text-xs font-mono font-bold px-5 py-2.5 rounded-lg hover:bg-[#2962ff]/90 transition-all shadow-md"
          >
            Apply Indicators
          </button>
        </div>
      </div>
    </div>
  );
};
