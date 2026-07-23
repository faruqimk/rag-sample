import { SymbolData, Candle, NewsItem, CommunityComment, StrategyResult } from '../types';

export const INITIAL_SYMBOLS: SymbolData[] = [
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    exchange: 'INDEX • BYBIT',
    category: 'crypto',
    price: 64281.50,
    change24h: 1240.20,
    change24hPct: 1.96,
    high24h: 65120.00,
    low24h: 62890.10,
    open24h: 63041.30,
    close24h: 64281.50,
    volume24h: '14.28K',
    isFavorite: true,
    precision: 2,
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum / US Dollar',
    exchange: 'INDEX • BYBIT',
    category: 'crypto',
    price: 3412.10,
    change24h: 71.50,
    change24hPct: 2.14,
    high24h: 3450.00,
    low24h: 3320.00,
    open24h: 3340.60,
    close24h: 3412.10,
    volume24h: '185.4K',
    isFavorite: true,
    precision: 2,
  },
  {
    symbol: 'SOLUSD',
    name: 'Solana / US Dollar',
    exchange: 'INDEX • BYBIT',
    category: 'crypto',
    price: 142.82,
    change24h: -0.65,
    change24hPct: -0.45,
    high24h: 146.50,
    low24h: 140.10,
    open24h: 143.47,
    close24h: 142.82,
    volume24h: '942.1K',
    isFavorite: true,
    precision: 2,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 189.43,
    change24h: 0.23,
    change24hPct: 0.12,
    high24h: 191.20,
    low24h: 188.10,
    open24h: 189.20,
    close24h: 189.43,
    volume24h: '42.8M',
    isFavorite: false,
    precision: 2,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 822.79,
    change24h: 33.20,
    change24hPct: 4.21,
    high24h: 828.00,
    low24h: 792.50,
    open24h: 789.59,
    close24h: 822.79,
    volume24h: '58.1M',
    isFavorite: true,
    precision: 2,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    category: 'stocks',
    price: 218.60,
    change24h: -3.80,
    change24hPct: -1.71,
    high24h: 224.50,
    low24h: 216.10,
    open24h: 222.40,
    close24h: 218.60,
    volume24h: '31.2M',
    isFavorite: false,
    precision: 2,
  },
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    exchange: 'FX • OANDA',
    category: 'forex',
    price: 1.0894,
    change24h: 0.0028,
    change24hPct: 0.26,
    high24h: 1.0912,
    low24h: 1.0860,
    open24h: 1.0866,
    close24h: 1.0894,
    volume24h: '1.2M',
    isFavorite: false,
    precision: 4,
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin / US Dollar',
    exchange: 'BINANCE',
    category: 'crypto',
    price: 0.1245,
    change24h: 0.0062,
    change24hPct: 5.24,
    high24h: 0.1280,
    low24h: 0.1180,
    open24h: 0.1183,
    close24h: 0.1245,
    volume24h: '1.8B',
    isFavorite: true,
    precision: 4,
  }
];

export function generateHistoricalCandles(basePrice: number, count = 80): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = basePrice * 0.92; // start slightly lower for an overall bullish trend
  const now = Date.now();
  const timeStep = 3600 * 1000 * 4; // 4 hour candles

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * timeStep;
    const volatility = basePrice * 0.012;
    const change = (Math.random() - 0.48) * volatility;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.6;
    const low = Math.min(open, close) - Math.random() * volatility * 0.6;
    const volume = Math.floor(Math.random() * 5000 + 2000);

    candles.push({
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  // Ensure last candle close matches basePrice roughly
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return candles;
}

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Whale Alert: 1,500 BTC ($96M) moved to Binance exchange',
    timeAgo: '2 mins ago',
    category: 'Whale',
    source: 'WhaleStats',
    sentiment: 'BEARISH',
  },
  {
    id: 'n2',
    title: 'US CPI Data released at 2.9% YoY - Fed rate cut expectations rise',
    timeAgo: '15 mins ago',
    category: 'Macro',
    source: 'Bloomberg Terminal',
    sentiment: 'BULLISH',
  },
  {
    id: 'n3',
    title: 'Bitcoin Mining Hashrate touches all-time high of 680 EH/s',
    timeAgo: '42 mins ago',
    category: 'On-Chain',
    source: 'Glassnode',
    sentiment: 'BULLISH',
  },
  {
    id: 'n4',
    title: 'NVIDIA quarterly earnings exceed Wall St estimates by 18%',
    timeAgo: '1 hour ago',
    category: 'Earnings',
    source: 'Reuters',
    sentiment: 'BULLISH',
  }
];

export const INITIAL_COMMUNITY_COMMENTS: CommunityComment[] = [
  {
    id: 'c1',
    user: 'Satoshi_N',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    badge: 'PRO',
    text: 'BTC breaking through $64,200 resistance with heavy spot volume. RSI holding strong above 60. Next stop $68K!',
    timeAgo: '12m ago',
    likes: 42,
    sentiment: 'BULLISH',
  },
  {
    id: 'c2',
    user: 'CryptoWhale_99',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    badge: 'VIP',
    text: 'Watch out for liquidity sweep near $65k high. Funding rates are creeping up, so a brief flush to $63k is possible.',
    timeAgo: '28m ago',
    likes: 19,
    sentiment: 'BEARISH',
  },
  {
    id: 'c3',
    user: 'AlphaTrader',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    badge: 'BULL',
    text: 'Macd golden cross on 4H chart confirmed! Longed $63,800 with tight SL.',
    timeAgo: '1h ago',
    likes: 31,
    sentiment: 'BULLISH',
  }
];

export const STRATEGY_PRESETS: StrategyResult[] = [
  {
    name: 'MACD + EMA Crossover Strategy (20/50)',
    netProfit: '+142.80%',
    winRate: '68.4%',
    maxDrawdown: '-11.20%',
    totalTrades: 128,
    profitFactor: '2.34',
    sharpeRatio: '1.92',
    equityCurve: [10000, 10400, 10200, 11100, 11800, 11500, 12600, 13400, 14200, 15100, 16800, 18400, 21200, 24280],
  },
  {
    name: 'RSI Mean Reversion & Bollinger Bands',
    netProfit: '+89.40%',
    winRate: '72.1%',
    maxDrawdown: '-8.50%',
    totalTrades: 210,
    profitFactor: '1.98',
    sharpeRatio: '2.10',
    equityCurve: [10000, 10250, 10600, 10900, 11300, 11800, 12400, 12900, 13800, 14900, 16200, 17500, 18940],
  },
  {
    name: 'Breakout & Volume Profile Strategy',
    netProfit: '+215.30%',
    winRate: '58.9%',
    maxDrawdown: '-16.40%',
    totalTrades: 94,
    profitFactor: '2.81',
    sharpeRatio: '1.85',
    equityCurve: [10000, 9800, 11200, 12800, 12100, 14500, 16200, 15800, 18900, 22100, 26400, 31530],
  }
];
