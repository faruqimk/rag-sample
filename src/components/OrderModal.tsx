import React, { useState } from 'react';
import { SymbolData, Order } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbolData: SymbolData;
  initialType: 'BUY' | 'SELL';
  onExecuteOrder: (order: Order) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  symbolData,
  initialType,
  onExecuteOrder,
}) => {
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>(initialType);
  const [orderMode, setOrderMode] = useState<'MARKET' | 'LIMIT' | 'STOP'>('MARKET');
  const [amount, setAmount] = useState<number>(0.1);
  const [leverage, setLeverage] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(symbolData.price);
  const [takeProfit, setTakeProfit] = useState<boolean>(false);
  const [tpPrice, setTpPrice] = useState<number>(symbolData.price * 1.05);
  const [stopLoss, setStopLoss] = useState<boolean>(false);
  const [slPrice, setSlPrice] = useState<number>(symbolData.price * 0.96);

  if (!isOpen) return null;

  const totalValueUSD = amount * symbolData.price;
  const marginRequiredUSD = totalValueUSD / leverage;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      symbol: symbolData.symbol,
      type: orderType,
      mode: orderMode,
      entryPrice: orderMode === 'MARKET' ? symbolData.price : limitPrice,
      currentPrice: symbolData.price,
      amount,
      leverage,
      pnl: 0,
      tp: takeProfit ? tpPrice : undefined,
      sl: stopLoss ? slPrice : undefined,
      timestamp: Date.now(),
      status: 'OPEN',
    };

    onExecuteOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131722] border border-[#2a2e39] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-[#0f131e] border-b border-[#2a2e39]">
          <button
            type="button"
            onClick={() => setOrderType('BUY')}
            className={`py-2.5 font-mono font-bold text-xs uppercase rounded-lg transition-all ${
              orderType === 'BUY'
                ? 'bg-[#20a28a] text-[#003027] shadow-lg'
                : 'text-[#868993] hover:text-white'
            }`}
          >
            Buy / Long
          </button>
          <button
            type="button"
            onClick={() => setOrderType('SELL')}
            className={`py-2.5 font-mono font-bold text-xs uppercase rounded-lg transition-all ${
              orderType === 'SELL'
                ? 'bg-[#da2237] text-white shadow-lg'
                : 'text-[#868993] hover:text-white'
            }`}
          >
            Sell / Short
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-mono text-xs">
          {/* Order Mode */}
          <div className="flex bg-[#171b26] p-1 rounded-lg border border-[#2a2e39]">
            {(['MARKET', 'LIMIT', 'STOP'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setOrderMode(m)}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  orderMode === m
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#868993] hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Symbol Info */}
          <div className="flex justify-between items-center bg-[#171b26] p-3 rounded border border-[#2a2e39]">
            <div>
              <span className="text-[#868993] text-[10px] block">ASSET</span>
              <span className="font-bold text-white text-sm">{symbolData.symbol}</span>
            </div>
            <div className="text-right">
              <span className="text-[#868993] text-[10px] block">CURRENT PRICE</span>
              <span className="font-bold text-[#66dabf] text-sm">${symbolData.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Limit Price Input if not market */}
          {orderMode !== 'MARKET' && (
            <div>
              <label className="text-[#868993] text-[10px] block mb-1">LIMIT PRICE (USD)</label>
              <input
                type="number"
                step="any"
                value={limitPrice}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
                className="w-full bg-[#171b26] border border-[#2a2e39] rounded px-3 py-2 text-white font-bold focus:outline-none focus:border-[#2962ff]"
              />
            </div>
          )}

          {/* Amount Input */}
          <div>
            <div className="flex justify-between text-[10px] text-[#868993] mb-1">
              <span>POSITION SIZE</span>
              <span>Total: ${totalValueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0.001"
                value={amount}
                onChange={(e) => setAmount(Math.max(0.001, Number(e.target.value)))}
                className="flex-1 bg-[#171b26] border border-[#2a2e39] rounded px-3 py-2 text-white font-bold focus:outline-none focus:border-[#2962ff]"
              />
              <span className="bg-[#1b1f2b] border border-[#2a2e39] px-3 py-2 rounded text-[#b6c4ff] font-bold">
                {symbolData.symbol.replace('USD', '')}
              </span>
            </div>
          </div>

          {/* Leverage Selector Slider */}
          <div>
            <div className="flex justify-between text-[10px] text-[#868993] mb-1">
              <span>LEVERAGE</span>
              <span className="text-[#2962ff] font-bold">{leverage}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="w-full accent-[#2962ff] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#868993] mt-1">
              <span>1x</span>
              <span>25x</span>
              <span>50x</span>
              <span>100x</span>
            </div>
          </div>

          {/* TP & SL Toggles */}
          <div className="space-y-2 pt-2 border-t border-[#2a2e39]">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[#c3c5d8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.checked)}
                  className="accent-[#20a28a]"
                />
                <span>Take Profit (TP)</span>
              </label>
              {takeProfit && (
                <input
                  type="number"
                  step="any"
                  value={tpPrice}
                  onChange={(e) => setTpPrice(Number(e.target.value))}
                  className="w-28 bg-[#171b26] border border-[#2a2e39] rounded px-2 py-1 text-right text-white font-bold"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[#c3c5d8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={stopLoss}
                  onChange={(e) => setStopLoss(e.target.checked)}
                  className="accent-[#da2237]"
                />
                <span>Stop Loss (SL)</span>
              </label>
              {stopLoss && (
                <input
                  type="number"
                  step="any"
                  value={slPrice}
                  onChange={(e) => setSlPrice(Number(e.target.value))}
                  className="w-28 bg-[#171b26] border border-[#2a2e39] rounded px-2 py-1 text-right text-white font-bold"
                />
              )}
            </div>
          </div>

          {/* Margin Summary */}
          <div className="bg-[#171b26] p-3 rounded border border-[#2a2e39] flex justify-between text-xs">
            <span className="text-[#868993]">Required Margin</span>
            <span className="font-bold text-white">${marginRequiredUSD.toFixed(2)} USD</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#262a35] hover:bg-[#313441] text-[#c3c5d8] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
                orderType === 'BUY'
                  ? 'bg-[#20a28a] hover:bg-[#66dabf] text-[#003027]'
                  : 'bg-[#da2237] hover:bg-[#ffb3b0] hover:text-[#680010]'
              }`}
            >
              Confirm {orderType} Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
