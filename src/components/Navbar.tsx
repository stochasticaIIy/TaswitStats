import React from 'react';
import { BarChart3, MapPin, Users, Award } from 'lucide-react';

interface NavbarProps {
  activeTab: 'general' | 'turnout' | 'results';
  setActiveTab: (tab: 'general' | 'turnout' | 'results') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
            MA
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-['Alexandria']">
              انتخابات المغرب 2026
            </span>
            <span className="block text-[11px] text-slate-400 -mt-0.5">
              مجلس النواب · 395 مقعد
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean interactive segmented controls with functional click handlers) */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'general'
                ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/30'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span>الإحصائيات العامة</span>
          </button>

          <button
            onClick={() => setActiveTab('turnout')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'turnout'
                ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-950/50'
                : 'text-slate-400 hover:text-sky-300 hover:bg-sky-950/30'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>خريطة المشاركة</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'results'
                ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-950/50'
                : 'text-slate-400 hover:text-amber-300 hover:bg-amber-950/30'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>النتائج والدوائر</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Majority status tracker */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>عتبة الأغلبية:</span>
            <span className="font-mono font-bold text-white tabular-nums">198 / 395</span>
          </div>
        </div>
      </div>
    </header>
  );
};
