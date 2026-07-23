import React, { useState } from 'react';
import { SymbolData, Order, CommunityComment, StrategyResult } from '../types';
import { INITIAL_COMMUNITY_COMMENTS, STRATEGY_PRESETS } from '../data/mockData';

interface BottomPanelProps {
  symbolData: SymbolData;
  orders: Order[];
  onCloseOrder: (id: string) => void;
  onOpenOrderModal: (type: 'BUY' | 'SELL') => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  symbolData,
  orders,
  onCloseOrder,
  onOpenOrderModal,
}) => {
  const [activeTab, setActiveTab] = useState<'tech' | 'order' | 'sentiment' | 'strategy'>('tech');

  // Sentiment votes
  const [sentimentVotes, setSentimentVotes] = useState({ bullish: 72, neutral: 12, bearish: 16 });
  const [userVoted, setUserVoted] = useState<'bullish' | 'bearish' | null>(null);

  // Comments state
  const [comments, setComments] = useState<CommunityComment[]>(INITIAL_COMMUNITY_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  // Selected Strategy
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);
  const activeStrategy: StrategyResult = STRATEGY_PRESETS[selectedStrategyIndex];

  const handleVote = (type: 'bullish' | 'bearish') => {
    if (userVoted) return;
    setUserVoted(type);
    setSentimentVotes((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommunityComment = {
      id: `c_${Date.now()}`,
      user: 'You (Trader)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      badge: 'PRO',
      text: newCommentText,
      timeAgo: 'Just now',
      likes: 1,
      sentiment: 'BULLISH',
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  const openOrders = orders.filter((o) => o.status === 'OPEN' && o.symbol === symbolData.symbol);

  return (
    <div className="bg-[#131722] border-t border-[#2a2e39] flex flex-col shrink-0">
      {/* Tab Navigation Headers */}
      <div className="flex border-b border-[#2a2e39] h-11 items-center px-4 overflow-x-auto custom-scrollbar bg-[#0f131e]">
        <button
          onClick={() => setActiveTab('tech')}
          className={`h-full px-4 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'tech'
              ? 'border-b-2 border-[#2962ff] text-[#b6c4ff] bg-[#1b1f2b]'
              : 'text-[#868993] hover:text-[#dfe2f2]'
          }`}
        >
          Technical Analysis
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`h-full px-4 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'order'
              ? 'border-b-2 border-[#2962ff] text-[#b6c4ff] bg-[#1b1f2b]'
              : 'text-[#868993] hover:text-[#dfe2f2]'
          }`}
        >
          <span>Order Panel & Book</span>
          {openOrders.length > 0 && (
            <span className="bg-[#20a28a] text-[#003027] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {openOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sentiment')}
          className={`h-full px-4 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'sentiment'
              ? 'border-b-2 border-[#2962ff] text-[#b6c4ff] bg-[#1b1f2b]'
              : 'text-[#868993] hover:text-[#dfe2f2]'
          }`}
        >
          Community Sentiment
        </button>
        <button
          onClick={() => setActiveTab('strategy')}
          className={`h-full px-4 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'strategy'
              ? 'border-b-2 border-[#2962ff] text-[#b6c4ff] bg-[#1b1f2b]'
              : 'text-[#868993] hover:text-[#dfe2f2]'
          }`}
        >
          Strategy Tester
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="p-4 md:p-6">
        {activeTab === 'tech' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gauge / Indicator Summary */}
            <div className="bg-[#1b1f2b] p-5 rounded-lg border border-[#2a2e39] flex flex-col items-center justify-between shadow-inner">
              <h4 className="text-xs font-mono font-bold text-[#868993] uppercase mb-2 w-full text-left flex justify-between items-center">
                <span>Technical Rating</span>
                <span className="text-[10px] text-[#b6c4ff] bg-[#2962ff]/10 px-2 py-0.5 rounded">4H Timeframe</span>
              </h4>

              <div className="relative w-44 h-24 overflow-hidden my-3">
                <div className="absolute inset-0 border-[12px] border-[#262a35] rounded-full clip-half"></div>
                <div className="absolute inset-0 border-[12px] border-[#66dabf] rounded-full clip-half rotate-[45deg]"></div>
                <div className="absolute bottom-0 w-full text-center">
                  <span className="text-xl font-bold font-mono text-[#66dabf] tracking-wide">STRONG BUY</span>
                </div>
              </div>

              <div className="flex justify-between w-full text-[10px] text-[#868993] uppercase font-mono px-2 pt-2 border-t border-[#2a2e39]">
                <span className="text-[#ffb4ab]">Sell</span>
                <span>Neutral</span>
                <span className="text-[#66dabf] font-bold">Buy</span>
              </div>
            </div>

            {/* Oscillators Table */}
            <div className="bg-[#1b1f2b] p-5 rounded-lg border border-[#2a2e39] shadow-inner">
              <h4 className="text-xs font-mono font-bold text-[#868993] uppercase mb-4 flex justify-between">
                <span>Oscillators</span>
                <span className="text-[#66dabf] font-normal">Summary: Bullish</span>
              </h4>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-[#2a2e39]/50 pb-2">
                  <span className="text-[#c3c5d8]">Relative Strength Index (14)</span>
                  <span className="text-[#66dabf] font-semibold">62.45 Neutral</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#2a2e39]/50 pb-2">
                  <span className="text-[#c3c5d8]">Stochastic %K (14, 3, 3)</span>
                  <span className="text-[#b6c4ff] font-semibold">78.12 Buy</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#2a2e39]/50 pb-2">
                  <span className="text-[#c3c5d8]">MACD Level (12, 26)</span>
                  <span className="text-[#66dabf] font-semibold">412.10 Buy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#c3c5d8]">Commodity Channel Index (20)</span>
                  <span className="text-[#66dabf] font-semibold">118.40 Buy</span>
                </div>
              </div>
            </div>

            {/* Sentiment Gauge */}
            <div className="bg-[#1b1f2b] p-5 rounded-lg border border-[#2a2e39] shadow-inner">
              <h4 className="text-xs font-mono font-bold text-[#868993] uppercase mb-4">Sentiment</h4>
              <div className="flex items-end gap-1.5 h-20 mb-4 bg-[#171b26] p-2 rounded border border-[#2a2e39]">
                <div className="flex-1 bg-[#66dabf] rounded-t transition-all duration-500" style={{ height: `${sentimentVotes.bullish}%` }}></div>
                <div className="flex-1 bg-[#434656] rounded-t transition-all duration-500" style={{ height: `${sentimentVotes.neutral}%` }}></div>
                <div className="flex-1 bg-[#ffb4ab] rounded-t transition-all duration-500" style={{ height: `${sentimentVotes.bearish}%` }}></div>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <div className="flex flex-col">
                  <span className="text-[#66dabf]">Bullish</span>
                  <span className="font-bold text-white">{sentimentVotes.bullish}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#868993]">Neutral</span>
                  <span className="font-bold text-white">{sentimentVotes.neutral}%</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[#ffb4ab]">Bearish</span>
                  <span className="font-bold text-white">{sentimentVotes.bearish}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'order' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Book Preview */}
            <div className="bg-[#1b1f2b] p-4 rounded-lg border border-[#2a2e39]">
              <h4 className="text-xs font-mono font-bold text-[#868993] uppercase mb-3 flex justify-between">
                <span>Order Book ({symbolData.symbol})</span>
                <span className="text-[#66dabf]">Spread: 0.50 USD</span>
              </h4>
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                {/* Asks (Sells) */}
                <div>
                  <div className="flex justify-between text-[10px] text-[#868993] mb-1">
                    <span>Ask Price</span>
                    <span>Amount</span>
                  </div>
                  {[0.4, 0.8, 1.2, 1.6, 2.0].map((step, idx) => {
                    const price = symbolData.price + step;
                    const qty = (Math.random() * 2 + 0.1).toFixed(3);
                    return (
                      <div key={idx} className="flex justify-between py-1 border-b border-[#2a2e39]/30 relative overflow-hidden">
                        <div
                          className="absolute right-0 top-0 bottom-0 bg-[#da2237]/15 pointer-events-none"
                          style={{ width: `${Math.min(100, Number(qty) * 40)}%` }}
                        />
                        <span className="text-[#ffb4ab] font-bold z-10">{price.toFixed(symbolData.precision)}</span>
                        <span className="text-[#c3c5d8] z-10">{qty}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bids (Buys) */}
                <div>
                  <div className="flex justify-between text-[10px] text-[#868993] mb-1">
                    <span>Bid Price</span>
                    <span>Amount</span>
                  </div>
                  {[0.4, 0.8, 1.2, 1.6, 2.0].map((step, idx) => {
                    const price = symbolData.price - step;
                    const qty = (Math.random() * 2.5 + 0.2).toFixed(3);
                    return (
                      <div key={idx} className="flex justify-between py-1 border-b border-[#2a2e39]/30 relative overflow-hidden">
                        <div
                          className="absolute right-0 top-0 bottom-0 bg-[#20a28a]/15 pointer-events-none"
                          style={{ width: `${Math.min(100, Number(qty) * 40)}%` }}
                        />
                        <span className="text-[#66dabf] font-bold z-10">{price.toFixed(symbolData.precision)}</span>
                        <span className="text-[#c3c5d8] z-10">{qty}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Open Positions List */}
            <div className="bg-[#1b1f2b] p-4 rounded-lg border border-[#2a2e39] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-mono font-bold text-[#868993] uppercase">
                    Active Open Positions
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenOrderModal('BUY')}
                      className="bg-[#20a28a] text-[#003027] text-[10px] font-mono font-bold px-2.5 py-1 rounded hover:bg-[#66dabf]"
                    >
                      + Long
                    </button>
                    <button
                      onClick={() => onOpenOrderModal('SELL')}
                      className="bg-[#da2237] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded hover:bg-[#ffb3b0] hover:text-black"
                    >
                      + Short
                    </button>
                  </div>
                </div>

                {openOrders.length === 0 ? (
                  <div className="text-center py-8 text-[#868993] text-xs font-mono bg-[#171b26] rounded border border-dashed border-[#2a2e39]">
                    No open positions for {symbolData.symbol}. Use BUY or SELL buttons to open a position.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto custom-scrollbar">
                    {openOrders.map((ord) => {
                      const pnlPos = ord.pnl >= 0;
                      return (
                        <div
                          key={ord.id}
                          className="bg-[#171b26] p-3 rounded border border-[#2a2e39] flex items-center justify-between font-mono text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.type === 'BUY'
                                  ? 'bg-[#20a28a]/20 text-[#66dabf]'
                                  : 'bg-[#da2237]/20 text-[#ffb4ab]'
                              }`}
                            >
                              {ord.type} {ord.leverage}x
                            </span>
                            <div>
                              <span className="font-bold text-white">{ord.amount} BTC</span>
                              <div className="text-[10px] text-[#868993]">
                                Entry: ${ord.entryPrice.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`font-bold ${pnlPos ? 'text-[#66dabf]' : 'text-[#ffb4ab]'}`}>
                              {pnlPos ? '+' : ''}${ord.pnl.toFixed(2)} USD
                            </div>
                            <button
                              onClick={() => onCloseOrder(ord.id)}
                              className="text-[10px] text-[#ffb4ab] hover:underline"
                            >
                              Close Position
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Community Voting Widget */}
            <div className="bg-[#1b1f2b] p-5 rounded-lg border border-[#2a2e39] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono font-bold text-[#868993] uppercase mb-2">
                  Market Pulse Voting
                </h4>
                <p className="text-xs text-[#c3c5d8] mb-4">
                  Where do you think {symbolData.symbol} is heading in the next 24 hours?
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => handleVote('bullish')}
                    className={`py-3 rounded-lg font-mono font-bold text-xs flex flex-col items-center gap-1 transition-all border ${
                      userVoted === 'bullish'
                        ? 'bg-[#20a28a] text-[#003027] border-[#66dabf]'
                        : 'bg-[#171b26] text-[#66dabf] border-[#2a2e39] hover:bg-[#20a28a]/20'
                    }`}
                  >
                    <span className="material-symbols-outlined">trending_up</span>
                    <span>BULLISH</span>
                  </button>

                  <button
                    onClick={() => handleVote('bearish')}
                    className={`py-3 rounded-lg font-mono font-bold text-xs flex flex-col items-center gap-1 transition-all border ${
                      userVoted === 'bearish'
                        ? 'bg-[#da2237] text-white border-[#ffb3b0]'
                        : 'bg-[#171b26] text-[#ffb4ab] border-[#2a2e39] hover:bg-[#da2237]/20'
                    }`}
                  >
                    <span className="material-symbols-outlined">trending_down</span>
                    <span>BEARISH</span>
                  </button>
                </div>
              </div>

              {userVoted && (
                <div className="bg-[#20a28a]/10 border border-[#20a28a] p-2 rounded text-[11px] text-[#66dabf] text-center font-mono font-semibold">
                  ✓ Your vote ({userVoted.toUpperCase()}) recorded!
                </div>
              )}
            </div>

            {/* Community Feed */}
            <div className="md:col-span-2 bg-[#1b1f2b] p-5 rounded-lg border border-[#2a2e39]">
              <h4 className="text-xs font-mono font-bold text-[#868993] uppercase mb-4">
                Community Discussions
              </h4>

              <form onSubmit={handlePostComment} className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Share analysis or thought on ${symbolData.symbol}...`}
                  className="flex-1 bg-[#171b26] border border-[#2a2e39] rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#2962ff]"
                />
                <button
                  type="submit"
                  className="bg-[#2962ff] text-white text-xs font-mono font-bold px-4 py-2 rounded hover:bg-[#2962ff]/90 transition-all"
                >
                  Post
                </button>
              </form>

              <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar">
                {comments.map((c) => (
                  <div key={c.id} className="bg-[#171b26] p-3 rounded border border-[#2a2e39] text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img src={c.avatar} alt={c.user} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold text-white font-mono">{c.user}</span>
                        <span className="bg-[#2962ff]/20 text-[#b6c4ff] text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                          {c.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#868993] font-mono">{c.timeAgo}</span>
                    </div>
                    <p className="text-[#dfe2f2] text-xs mb-2 leading-relaxed">{c.text}</p>
                    <div className="flex items-center justify-between text-[11px] text-[#868993] font-mono border-t border-[#2a2e39]/40 pt-1.5">
                      <span className={c.sentiment === 'BULLISH' ? 'text-[#66dabf]' : 'text-[#ffb4ab]'}>
                        {c.sentiment}
                      </span>
                      <button className="hover:text-white flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">thumb_up</span>
                        <span>{c.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strategy Selector */}
            <div className="bg-[#1b1f2b] p-5 rounded-lg border border-[#2a2e39]">
              <h4 className="text-xs font-mono font-bold text-[#868993] uppercase mb-3">
                Select Backtest Preset
              </h4>
              <div className="space-y-2">
                {STRATEGY_PRESETS.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedStrategyIndex(idx)}
                    className={`w-full text-left p-3 rounded border font-mono text-xs transition-all ${
                      selectedStrategyIndex === idx
                        ? 'bg-[#2962ff]/20 border-[#2962ff] text-white'
                        : 'bg-[#171b26] border-[#2a2e39] text-[#c3c5d8] hover:border-[#434656]'
                    }`}
                  >
                    <div className="font-bold mb-1">{st.name}</div>
                    <div className="flex justify-between text-[10px] text-[#868993]">
                      <span>Net: <strong className="text-[#66dabf]">{st.netProfit}</strong></span>
                      <span>Win Rate: <strong className="text-white">{st.winRate}</strong></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance KPIs & Equity Curve Chart */}
            <div className="md:col-span-2 bg-[#1b1f2b] p-5 rounded-lg border border-[#2a2e39] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono font-bold text-[#868993] uppercase mb-4 flex justify-between">
                  <span>Strategy Metrics ({activeStrategy.name})</span>
                  <span className="text-[#66dabf]">Status: Validated</span>
                </h4>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5 font-mono text-xs">
                  <div className="bg-[#171b26] p-2.5 rounded border border-[#2a2e39]">
                    <span className="text-[10px] text-[#868993] block">Net Profit</span>
                    <span className="font-bold text-[#66dabf] text-sm">{activeStrategy.netProfit}</span>
                  </div>
                  <div className="bg-[#171b26] p-2.5 rounded border border-[#2a2e39]">
                    <span className="text-[10px] text-[#868993] block">Win Rate</span>
                    <span className="font-bold text-white text-sm">{activeStrategy.winRate}</span>
                  </div>
                  <div className="bg-[#171b26] p-2.5 rounded border border-[#2a2e39]">
                    <span className="text-[10px] text-[#868993] block">Max Drawdown</span>
                    <span className="font-bold text-[#ffb4ab] text-sm">{activeStrategy.maxDrawdown}</span>
                  </div>
                  <div className="bg-[#171b26] p-2.5 rounded border border-[#2a2e39]">
                    <span className="text-[10px] text-[#868993] block">Total Trades</span>
                    <span className="font-bold text-white text-sm">{activeStrategy.totalTrades}</span>
                  </div>
                  <div className="bg-[#171b26] p-2.5 rounded border border-[#2a2e39]">
                    <span className="text-[10px] text-[#868993] block">Profit Factor</span>
                    <span className="font-bold text-[#66dabf] text-sm">{activeStrategy.profitFactor}</span>
                  </div>
                  <div className="bg-[#171b26] p-2.5 rounded border border-[#2a2e39]">
                    <span className="text-[10px] text-[#868993] block">Sharpe Ratio</span>
                    <span className="font-bold text-white text-sm">{activeStrategy.sharpeRatio}</span>
                  </div>
                </div>

                {/* SVG Equity Curve */}
                <div className="bg-[#171b26] p-4 rounded border border-[#2a2e39]">
                  <span className="text-[10px] font-mono text-[#868993] block mb-2">Equity Growth Curve ($10,000 Starting Capital)</span>
                  <div className="h-28 w-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <path
                        d={`M 0 100 ${activeStrategy.equityCurve
                          .map((val, idx) => {
                            const x = (idx / (activeStrategy.equityCurve.length - 1)) * 500;
                            const minEq = Math.min(...activeStrategy.equityCurve) * 0.95;
                            const maxEq = Math.max(...activeStrategy.equityCurve) * 1.05;
                            const y = 100 - ((val - minEq) / (maxEq - minEq)) * 100;
                            return `L ${x} ${y}`;
                          })
                          .join(' ')} L 500 100 Z`}
                        fill="rgba(32, 162, 138, 0.15)"
                      />
                      <path
                        d={activeStrategy.equityCurve
                          .map((val, idx) => {
                            const x = (idx / (activeStrategy.equityCurve.length - 1)) * 500;
                            const minEq = Math.min(...activeStrategy.equityCurve) * 0.95;
                            const maxEq = Math.max(...activeStrategy.equityCurve) * 1.05;
                            const y = 100 - ((val - minEq) / (maxEq - minEq)) * 100;
                            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="#66dabf"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
