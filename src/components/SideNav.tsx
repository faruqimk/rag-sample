import React from 'react';
import { DrawingTool } from '../types';

interface SideNavProps {
  activeTool: DrawingTool;
  setActiveTool: (tool: DrawingTool) => void;
  onClearDrawings: () => void;
  drawingsCount: number;
}

export const SideNav: React.FC<SideNavProps> = ({
  activeTool,
  setActiveTool,
  onClearDrawings,
  drawingsCount,
}) => {
  const tools: { id: DrawingTool; icon: string; title: string }[] = [
    { id: 'cursor', icon: 'near_me', title: 'Cursor / Crosshair' },
    { id: 'trendline', icon: 'timeline', title: 'Trend Lines' },
    { id: 'fibonacci', icon: 'grid_goldenratio', title: 'Gann & Fibonacci Retracements' },
    { id: 'shapes', icon: 'pentagon', title: 'Geometric Shapes' },
    { id: 'text', icon: 'title', title: 'Text Note' },
    { id: 'patterns', icon: 'conversion_path', title: 'Harmonic Patterns' },
    { id: 'ruler', icon: 'straighten', title: 'Price / Date Ruler' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-14 border-r border-[#2a2e39] bg-[#0a0e19] shrink-0 z-20">
      <nav className="flex flex-col items-center py-4 gap-3">
        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`relative p-2 rounded transition-all group ${
                isActive
                  ? 'bg-[#2962ff] text-white shadow-md shadow-[#2962ff]/30'
                  : 'text-[#c3c5d8] hover:bg-[#262a35] hover:text-[#dfe2f2]'
              }`}
              title={t.title}
            >
              <span className="material-symbols-outlined text-xl">{t.icon}</span>
              <div className="absolute left-16 bg-[#1b1f2b] text-[#dfe2f2] text-[11px] font-mono px-2 py-1 rounded shadow-xl border border-[#2a2e39] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                {t.title}
              </div>
            </button>
          );
        })}

        <div className="h-px w-8 bg-[#2a2e39] my-1"></div>

        <button
          onClick={() => setActiveTool(activeTool === 'magnet' ? 'cursor' : 'magnet')}
          className={`p-2 rounded transition-all ${
            activeTool === 'magnet'
              ? 'bg-[#20a28a] text-[#003027] font-bold'
              : 'text-[#c3c5d8] hover:bg-[#262a35] hover:text-[#dfe2f2]'
          }`}
          title="Magnet Mode (Snap to OHLC)"
        >
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
        </button>

        <button
          onClick={onClearDrawings}
          className={`p-2 rounded text-[#ffb4ab] hover:bg-[#93000a]/40 transition-all relative group ${
            drawingsCount === 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          disabled={drawingsCount === 0}
          title="Clear Chart Drawings"
        >
          <span className="material-symbols-outlined text-xl">delete</span>
          {drawingsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#da2237] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {drawingsCount}
            </span>
          )}
        </button>
      </nav>
    </aside>
  );
};
