export type Timeframe = '15M' | '1H' | '4H' | '1D' | '1W';
export type ChartType = 'candlestick' | 'line' | 'area';

export type DrawingTool = 
  | 'cursor' 
  | 'crosshair' 
  | 'trendline' 
  | 'fibonacci' 
  | 'shapes' 
  | 'text' 
  | 'patterns' 
  | 'ruler' 
  | 'magnet' 
  | 'trash';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SymbolData {
  symbol: string;
  name: string;
  exchange: string;
  category: 'crypto' | 'stocks' | 'forex';
  price: number;
  change24h: number;
  change24hPct: number;
  high24h: number;
  low24h: number;
  open24h: number;
  close24h: number;
  volume24h: string;
  isFavorite?: boolean;
  precision: number;
}

export interface IndicatorState {
  sma20: boolean;
  sma50: boolean;
  ema: boolean;
  bollinger: boolean;
  rsi: boolean;
  macd: boolean;
  volume: boolean;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  mode: 'MARKET' | 'LIMIT' | 'STOP';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
  pnl: number;
  tp?: number;
  sl?: number;
  timestamp: number;
  status: 'OPEN' | 'CLOSED';
}

export interface NewsItem {
  id: string;
  title: string;
  timeAgo: string;
  category: 'Whale' | 'Macro' | 'On-Chain' | 'Earnings';
  source: string;
  sentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
}

export interface CommunityComment {
  id: string;
  user: string;
  avatar: string;
  badge: 'PRO' | 'BULL' | 'BEAR' | 'VIP';
  text: string;
  timeAgo: string;
  likes: number;
  userLiked?: boolean;
  sentiment: 'BULLISH' | 'BEARISH';
}

export interface StrategyResult {
  name: string;
  netProfit: string;
  winRate: string;
  maxDrawdown: string;
  totalTrades: number;
  profitFactor: string;
  sharpeRatio: string;
  equityCurve: number[];
}
