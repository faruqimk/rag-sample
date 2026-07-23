import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { PriceTickerBar } from './components/PriceTickerBar';
import { TradingChart } from './components/TradingChart';
import { BottomPanel } from './components/BottomPanel';
import { RightPanel } from './components/RightPanel';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { OrderModal } from './components/OrderModal';
import { IndicatorsModal } from './components/IndicatorsModal';
import { WalletModal } from './components/WalletModal';
import { MobileBottomNav } from './components/MobileBottomNav';

import { SymbolData, Candle, Timeframe, ChartType, IndicatorState, DrawingTool, Order, NewsItem } from './types';
import { INITIAL_SYMBOLS, generateHistoricalCandles, INITIAL_NEWS } from './data/mockData';

export default function App() {
  const [symbols, setSymbols] = useState<SymbolData[]>(INITIAL_SYMBOLS);
  const [activeSymbol, setActiveSymbol] = useState<SymbolData>(INITIAL_SYMBOLS[0]);
  const [timeframe, setTimeframe] = useState<Timeframe>('4H');
  const [chartType, setChartType] = useState<ChartType>('candlestick');

  // Indicators State
  const [indicators, setIndicators] = useState<IndicatorState>({
    sma20: true,
    sma50: true,
    ema: false,
    bollinger: false,
    rsi: true,
    macd: true,
    volume: true,
  });

  // Chart Drawings & Active Tool
  const [activeTool, setActiveTool] = useState<DrawingTool>('cursor');
  const [drawings, setDrawings] = useState<{ type: string; startX: number; startY: number; endX: number; endY: number }[]>([]);

  // Candles State
  const [candles, setCandles] = useState<Candle[]>(() =>
    generateHistoricalCandles(INITIAL_SYMBOLS[0].price, 80)
  );

  // Active Orders State (initialized with 1 open demo order)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord_demo_1',
      symbol: 'BTCUSD',
      type: 'BUY',
      mode: 'MARKET',
      entryPrice: 63850.00,
      currentPrice: 64281.50,
      amount: 0.5,
      leverage: 10,
      pnl: (64281.50 - 63850.00) * 0.5 * 10,
      tp: 68000,
      sl: 62000,
      timestamp: Date.now() - 3600000,
      status: 'OPEN',
    },
  ]);

  // News State
  const [newsItems] = useState<NewsItem[]>(INITIAL_NEWS);

  // Wallet Connection State
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  // Active Nav View
  const [activeNav, setActiveNav] = useState('Chart');

  // Modals Visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderModalType, setOrderModalType] = useState<'BUY' | 'SELL'>('BUY');
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle symbol change
  const handleSelectSymbol = useCallback((symbol: SymbolData) => {
    setActiveSymbol(symbol);
    setCandles(generateHistoricalCandles(symbol.price, 80));
    setDrawings([]);
  }, []);

  // Toggle Favorite
  const handleToggleFavorite = useCallback((symbolName: string) => {
    setSymbols((prev) =>
      prev.map((s) => (s.symbol === symbolName ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  }, []);

  // Execute Order
  const handleExecuteOrder = useCallback((newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  // Close Order
  const handleCloseOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'CLOSED' } : o)));
  }, []);

  // Real-time Tick Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbols((prevSymbols) =>
        prevSymbols.map((sym) => {
          // Random price tick delta
          const volatility = sym.price * 0.0008;
          const delta = (Math.random() - 0.49) * volatility;
          const newPrice = Math.max(0.0001, Number((sym.price + delta).toFixed(sym.precision)));

          const change24h = newPrice - sym.open24h;
          const change24hPct = (change24h / sym.open24h) * 100;

          const high24h = Math.max(sym.high24h, newPrice);
          const low24h = Math.min(sym.low24h, newPrice);

          return {
            ...sym,
            price: newPrice,
            change24h,
            change24hPct,
            high24h,
            low24h,
            close24h: newPrice,
          };
        })
      );
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  // Keep activeSymbol in sync with updated prices & update candle / orders PnL
  useEffect(() => {
    const updatedActive = symbols.find((s) => s.symbol === activeSymbol.symbol);
    if (!updatedActive) return;

    setActiveSymbol(updatedActive);

    // Update last candle in real-time
    setCandles((prevCandles) => {
      if (prevCandles.length === 0) return prevCandles;
      const copy = [...prevCandles];
      const lastCandle = { ...copy[copy.length - 1] };
      lastCandle.close = updatedActive.price;
      lastCandle.high = Math.max(lastCandle.high, updatedActive.price);
      lastCandle.low = Math.min(lastCandle.low, updatedActive.price);
      copy[copy.length - 1] = lastCandle;
      return copy;
    });

    // Update open orders PnL
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.status !== 'OPEN' || ord.symbol !== updatedActive.symbol) return ord;
        const diff =
          ord.type === 'BUY'
            ? updatedActive.price - ord.entryPrice
            : ord.entryPrice - updatedActive.price;
        const pnl = diff * ord.amount * ord.leverage;
        return {
          ...ord,
          currentPrice: updatedActive.price,
          pnl: Number(pnl.toFixed(2)),
        };
      })
    );
  }, [symbols]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e19] text-[#dfe2f2] font-['Inter',sans-serif] selection:bg-[#2962ff] selection:text-white">
      {/* Top Header App Bar */}
      <Header
        activeSymbol={activeSymbol}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenOrderModal={(type) => {
          setOrderModalType(type);
          setIsOrderOpen(true);
        }}
        onOpenWalletModal={() => setIsWalletOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side Drawing Navigation */}
        <SideNav
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onClearDrawings={() => setDrawings([])}
          drawingsCount={drawings.length}
        />

        {/* Central Workspace Section */}
        <section className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
          {/* Price Ticker Bar */}
          <PriceTickerBar
            symbolData={activeSymbol}
            onOpenOrderModal={(type) => {
              setOrderModalType(type);
              setIsOrderOpen(true);
            }}
            onOpenSearchModal={() => setIsSearchOpen(true)}
          />

          {/* Primary Trading Chart */}
          <TradingChart
            candles={candles}
            symbolData={activeSymbol}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            chartType={chartType}
            setChartType={setChartType}
            indicators={indicators}
            onOpenIndicatorsModal={() => setIsIndicatorsOpen(true)}
            activeTool={activeTool}
            drawings={drawings}
            setDrawings={setDrawings}
          />

          {/* Bottom Tabs Panel */}
          <BottomPanel
            symbolData={activeSymbol}
            orders={orders}
            onCloseOrder={handleCloseOrder}
            onOpenOrderModal={(type) => {
              setOrderModalType(type);
              setIsOrderOpen(true);
            }}
          />
        </section>

        {/* Right Side Watchlist & News Panel */}
        <RightPanel
          symbols={symbols}
          activeSymbol={activeSymbol}
          onSelectSymbol={handleSelectSymbol}
          onToggleFavorite={handleToggleFavorite}
          newsItems={newsItems}
        />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
      />

      {/* Modals & Dialogs */}
      <SymbolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={handleSelectSymbol}
      />

      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        symbolData={activeSymbol}
        initialType={orderModalType}
        onExecuteOrder={handleExecuteOrder}
      />

      <IndicatorsModal
        isOpen={isIndicatorsOpen}
        onClose={() => setIsIndicatorsOpen(false)}
        indicators={indicators}
        setIndicators={setIndicators}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        connectedWallet={connectedWallet}
        setConnectedWallet={setConnectedWallet}
      />
    </div>
  );
}
