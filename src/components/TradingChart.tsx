import React, { useRef, useEffect, useState } from 'react';
import { Candle, Timeframe, ChartType, IndicatorState, DrawingTool, SymbolData } from '../types';

interface TradingChartProps {
  candles: Candle[];
  symbolData: SymbolData;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  chartType: ChartType;
  setChartType: (ct: ChartType) => void;
  indicators: IndicatorState;
  onOpenIndicatorsModal: () => void;
  activeTool: DrawingTool;
  drawings: { type: string; startX: number; startY: number; endX: number; endY: number }[];
  setDrawings: React.Dispatch<React.SetStateAction<{ type: string; startX: number; startY: number; endX: number; endY: number }[]>>;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  candles,
  symbolData,
  timeframe,
  setTimeframe,
  chartType,
  setChartType,
  indicators,
  onOpenIndicatorsModal,
  activeTool,
  drawings,
  setDrawings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [crosshair, setCrosshair] = useState<{ x: number; y: number; price: number; candle?: Candle } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [showHotlinkReference, setShowHotlinkReference] = useState(false);

  // Active indicators count
  const activeIndicatorsCount = Object.values(indicators).filter(Boolean).length;

  // Render HTML5 Canvas Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas based on container
    const width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.parentElement?.clientHeight || 500;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, width, height);

    // Padding margins
    const paddingRight = 64; // price scale space
    const paddingBottom = indicators.rsi ? 120 : 40; // volume & time scale
    const chartWidth = width - paddingRight;
    const chartHeight = height - paddingBottom;

    // Calculate Min & Max Price
    let minPrice = Math.min(...candles.map((c) => c.low));
    let maxPrice = Math.max(...candles.map((c) => c.high));
    const priceRange = maxPrice - minPrice || 1;
    minPrice -= priceRange * 0.05;
    maxPrice += priceRange * 0.05;

    const maxVolume = Math.max(...candles.map((c) => c.volume), 1);

    // Candle bar width
    const candleCount = candles.length;
    const candleWidth = Math.max(3, chartWidth / candleCount - 2);
    const candleSpacing = chartWidth / candleCount;

    // Helper functions
    const getY = (price: number) => {
      return chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;
    };

    const getX = (index: number) => {
      return index * candleSpacing + candleSpacing / 2;
    };

    // Draw Grid Lines
    ctx.strokeStyle = '#2a2e39';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);

    const gridSteps = 6;
    for (let i = 0; i <= gridSteps; i++) {
      const y = (chartHeight / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 8; i++) {
      const x = (chartWidth / 8) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Calculate Moving Averages if active
    const sma20: (number | null)[] = [];
    const sma50: (number | null)[] = [];

    for (let i = 0; i < candles.length; i++) {
      if (i >= 19) {
        const sum20 = candles.slice(i - 19, i + 1).reduce((acc, c) => acc + c.close, 0);
        sma20.push(sum20 / 20);
      } else {
        sma20.push(null);
      }

      if (i >= 49) {
        const sum50 = candles.slice(i - 49, i + 1).reduce((acc, c) => acc + c.close, 0);
        sma50.push(sum50 / 50);
      } else {
        sma50.push(null);
      }
    }

    // Draw Bollinger Bands if enabled
    if (indicators.bollinger) {
      ctx.fillStyle = 'rgba(41, 98, 255, 0.08)';
      ctx.beginPath();
      for (let i = 19; i < candles.length; i++) {
        const avg = sma20[i]!;
        const slice = candles.slice(i - 19, i + 1).map((c) => c.close);
        const stdDev = Math.sqrt(slice.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / 20);
        const upper = avg + stdDev * 2;
        const x = getX(i);
        const y = getY(upper);
        if (i === 19) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let i = candles.length - 1; i >= 19; i--) {
        const avg = sma20[i]!;
        const slice = candles.slice(i - 19, i + 1).map((c) => c.close);
        const stdDev = Math.sqrt(slice.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / 20);
        const lower = avg - stdDev * 2;
        const x = getX(i);
        const y = getY(lower);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    // Draw Candlesticks or Line / Area
    if (chartType === 'area') {
      const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
      gradient.addColorStop(0, 'rgba(41, 98, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(41, 98, 255, 0.0)');

      ctx.beginPath();
      ctx.moveTo(getX(0), chartHeight);
      candles.forEach((c, i) => {
        ctx.lineTo(getX(i), getY(c.close));
      });
      ctx.lineTo(getX(candles.length - 1), chartHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = '#2962ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      candles.forEach((c, i) => {
        if (i === 0) ctx.moveTo(getX(i), getY(c.close));
        else ctx.lineTo(getX(i), getY(c.close));
      });
      ctx.stroke();
    } else if (chartType === 'line') {
      ctx.strokeStyle = '#2962ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      candles.forEach((c, i) => {
        if (i === 0) ctx.moveTo(getX(i), getY(c.close));
        else ctx.lineTo(getX(i), getY(c.close));
      });
      ctx.stroke();
    } else {
      // Candlesticks
      candles.forEach((c, i) => {
        const x = getX(i);
        const isUp = c.close >= c.open;
        const color = isUp ? '#089981' : '#f23645';

        const openY = getY(c.open);
        const closeY = getY(c.close);
        const highY = getY(c.high);
        const lowY = getY(c.low);

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Body
        ctx.fillStyle = color;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(openY - closeY), 2);
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

        // Volume bar at bottom
        if (indicators.volume) {
          const volHeight = (c.volume / maxVolume) * 50;
          ctx.fillStyle = isUp ? 'rgba(8, 153, 129, 0.25)' : 'rgba(242, 54, 69, 0.25)';
          ctx.fillRect(x - candleWidth / 2, chartHeight - volHeight, candleWidth, volHeight);
        }
      });
    }

    // Draw Moving Average lines
    if (indicators.sma20) {
      ctx.strokeStyle = '#ffb3b0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let started = false;
      sma20.forEach((val, i) => {
        if (val !== null) {
          const x = getX(i);
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    if (indicators.sma50) {
      ctx.strokeStyle = '#b6c4ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let started = false;
      sma50.forEach((val, i) => {
        if (val !== null) {
          const x = getX(i);
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Draw RSI Panel at bottom if active
    if (indicators.rsi) {
      const rsiTop = chartHeight + 15;
      const rsiHeight = 85;

      ctx.fillStyle = '#131722';
      ctx.fillRect(0, rsiTop, chartWidth, rsiHeight);

      // RSI guide lines (70 overbought, 30 oversold)
      ctx.strokeStyle = '#2a2e39';
      ctx.setLineDash([2, 2]);
      const y70 = rsiTop + rsiHeight * 0.3;
      const y30 = rsiTop + rsiHeight * 0.7;

      ctx.beginPath();
      ctx.moveTo(0, y70);
      ctx.lineTo(chartWidth, y70);
      ctx.moveTo(0, y30);
      ctx.lineTo(chartWidth, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#868993';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('RSI (14) 62.45', 10, rsiTop + 15);

      // Simple RSI wave simulation
      ctx.strokeStyle = '#66dabf';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      candles.forEach((_, i) => {
        const x = getX(i);
        const val = 50 + Math.sin(i * 0.3) * 22 + (Math.random() * 4 - 2);
        const y = rsiTop + rsiHeight - (val / 100) * rsiHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw Saved Lines / Ruler Annotations
    drawings.forEach((d) => {
      ctx.strokeStyle = '#2962ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(d.startX, d.startY);
      ctx.lineTo(d.endX, d.endY);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw line currently being drawn
    if (currentLine) {
      ctx.strokeStyle = '#20a28a';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(currentLine.startX, currentLine.startY);
      ctx.lineTo(currentLine.endX, currentLine.endY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Crosshair if hovering
    if (crosshair && crosshair.x <= chartWidth && crosshair.y <= chartHeight) {
      ctx.strokeStyle = 'rgba(223, 226, 242, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);

      ctx.beginPath();
      ctx.moveTo(crosshair.x, 0);
      ctx.lineTo(crosshair.x, chartHeight);
      ctx.moveTo(0, crosshair.y);
      ctx.lineTo(chartWidth, crosshair.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Y axis price box
      ctx.fillStyle = '#2962ff';
      ctx.fillRect(chartWidth, crosshair.y - 10, paddingRight, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(crosshair.price.toFixed(symbolData.precision), chartWidth + 6, crosshair.y + 3);
    }

    // Draw Price Scale on Right
    ctx.fillStyle = '#171b26';
    ctx.fillRect(chartWidth, 0, paddingRight, chartHeight);

    ctx.strokeStyle = '#2a2e39';
    ctx.beginPath();
    ctx.moveTo(chartWidth, 0);
    ctx.lineTo(chartWidth, chartHeight);
    ctx.stroke();

    ctx.fillStyle = '#8d90a2';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';

    for (let i = 0; i <= gridSteps; i++) {
      const y = (chartHeight / gridSteps) * i;
      const priceVal = maxPrice - (i / gridSteps) * (maxPrice - minPrice);
      ctx.fillText(priceVal.toFixed(0), chartWidth + paddingRight / 2, y + 3);
    }

    // Current Price Indicator Badge
    const lastPrice = symbolData.price;
    const currentY = getY(lastPrice);
    if (currentY >= 0 && currentY <= chartHeight) {
      ctx.fillStyle = '#66dabf';
      ctx.beginPath();
      ctx.moveTo(chartWidth - 6, currentY);
      ctx.lineTo(chartWidth, currentY - 8);
      ctx.lineTo(chartWidth + paddingRight, currentY - 8);
      ctx.lineTo(chartWidth + paddingRight, currentY + 8);
      ctx.lineTo(chartWidth, currentY + 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#00201a';
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.fillText(lastPrice.toFixed(0), chartWidth + paddingRight / 2 + 2, currentY + 3);
    }
  }, [candles, symbolData, chartType, indicators, drawings, currentLine, crosshair]);

  // Handle Mouse Hover & Drawing Interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chartWidth = canvas.clientWidth - 64;
    const chartHeight = canvas.clientHeight - (indicators.rsi ? 120 : 40);

    const minPrice = Math.min(...candles.map((c) => c.low)) * 0.95;
    const maxPrice = Math.max(...candles.map((c) => c.high)) * 1.05;
    const price = maxPrice - (y / chartHeight) * (maxPrice - minPrice);

    const candleIdx = Math.min(
      candles.length - 1,
      Math.max(0, Math.floor((x / chartWidth) * candles.length))
    );

    setCrosshair({ x, y, price, candle: candles[candleIdx] });

    if (isDrawing && currentLine) {
      setCurrentLine({ ...currentLine, endX: x, endY: y });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'cursor' || activeTool === 'trash') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentLine({ startX: x, startY: y, endX: x, endY: y });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentLine) {
      setDrawings((prev) => [...prev, { type: activeTool, ...currentLine }]);
      setIsDrawing(false);
      setCurrentLine(null);
    }
  };

  return (
    <div className="flex-1 relative bg-[#000000] chart-grid flex flex-col overflow-hidden min-h-[480px]" ref={containerRef}>
      {/* Floating Toolbar (Timeframes, Chart Type, Indicators, Hotlink toggle) */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 select-none">
        {/* Timeframe buttons */}
        <div className="glass-panel rounded-lg flex p-1 shadow-lg">
          {(['15M', '1H', '4H', '1D', '1W'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-mono font-semibold rounded transition-all ${
                timeframe === tf
                  ? 'bg-[#2962ff] text-[#f7f5ff] shadow-md'
                  : 'text-[#c3c5d8] hover:text-[#dfe2f2] hover:bg-[#262a35]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart type icons */}
        <div className="glass-panel rounded-lg flex p-1 gap-1 shadow-lg">
          <button
            onClick={() => setChartType('candlestick')}
            className={`p-1.5 rounded transition-all ${
              chartType === 'candlestick' ? 'bg-[#2962ff] text-white' : 'text-[#c3c5d8] hover:text-white'
            }`}
            title="Candlestick Chart"
          >
            <span className="material-symbols-outlined text-lg">candlestick_chart</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-1.5 rounded transition-all ${
              chartType === 'line' ? 'bg-[#2962ff] text-white' : 'text-[#c3c5d8] hover:text-white'
            }`}
            title="Line Chart"
          >
            <span className="material-symbols-outlined text-lg">show_chart</span>
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`p-1.5 rounded transition-all ${
              chartType === 'area' ? 'bg-[#2962ff] text-white' : 'text-[#c3c5d8] hover:text-white'
            }`}
            title="Area Chart"
          >
            <span className="material-symbols-outlined text-lg">area_chart</span>
          </button>
        </div>

        {/* Indicators toggle button */}
        <button
          onClick={onOpenIndicatorsModal}
          className="glass-panel rounded-lg flex items-center px-3 py-1 gap-2 text-xs font-mono font-semibold text-[#c3c5d8] hover:text-white hover:border-[#2962ff] transition-all shadow-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm text-[#2962ff]">add_circle</span>
          <span>INDICATORS</span>
          {activeIndicatorsCount > 0 && (
            <span className="bg-[#2962ff] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
              {activeIndicatorsCount}
            </span>
          )}
        </button>

        {/* Reference Image View toggle button */}
        <button
          onClick={() => setShowHotlinkReference(!showHotlinkReference)}
          className={`glass-panel rounded-lg flex items-center px-3 py-1 gap-1.5 text-xs font-mono transition-all cursor-pointer ${
            showHotlinkReference ? 'bg-[#2962ff]/30 text-white border-[#2962ff]' : 'text-[#868993] hover:text-[#dfe2f2]'
          }`}
          title="Toggle screenshot reference overlay from HTML"
        >
          <span className="material-symbols-outlined text-sm">image</span>
          <span className="hidden sm:inline">{showHotlinkReference ? 'Hide Snapshot' : 'View Snapshot'}</span>
        </button>
      </div>

      {/* Hotlink Image View (if toggled) */}
      {showHotlinkReference ? (
        <div className="absolute inset-0 z-0 bg-[#000000]">
          <img
            className="w-full h-full object-cover opacity-90"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfJ7V2wm7jun9_rgQuXSYOOa3-kS7oqO5VYdXHec3PV0J4jsvfoCUynqLFfkWlnOrG_CyssqR1t55Om00uvCSexlTW6mEygCLDgr8E7Dv-lYWUGQvQFk-TnxMBcBSRnTlXPS3rBHxkiFaqTX-2ZjiLlbIx4UAQoSdSTFarlcVN06-1VjVt489bhFVRKriSVL0Tpkmu8-MPFBR17svG8xC14ms5DlFR0fDEatvM4vWoWuyQUcbLiR_ZkB93Wp-fib4TyLqZlByfex5c"
            alt="TradingView Pro Chart Screenshot"
          />
        </div>
      ) : (
        /* Interactive HTML5 Canvas Chart */
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setCrosshair(null);
            setIsDrawing(false);
          }}
          className="w-full h-full cursor-crosshair block"
        />
      )}

      {/* Crosshair OHLC tooltip floating overlay */}
      {crosshair && crosshair.candle && !showHotlinkReference && (
        <div className="absolute top-16 left-4 bg-[#131722]/90 border border-[#2a2e39] backdrop-blur-md px-3 py-1.5 rounded text-[11px] font-mono flex items-center gap-3 text-[#c3c5d8] shadow-xl pointer-events-none z-10">
          <div><span className="text-[#868993]">O:</span> <span className="text-white">{crosshair.candle.open}</span></div>
          <div><span className="text-[#868993]">H:</span> <span className="text-[#66dabf]">{crosshair.candle.high}</span></div>
          <div><span className="text-[#868993]">L:</span> <span className="text-[#ffb4ab]">{crosshair.candle.low}</span></div>
          <div><span className="text-[#868993]">C:</span> <span className="text-white">{crosshair.candle.close}</span></div>
        </div>
      )}
    </div>
  );
};
