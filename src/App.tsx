/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GeneralStatsSection } from './components/GeneralStatsSection';
import { TurnoutMapSection } from './components/TurnoutMapSection';
import { ResultsAndCoalitionsSection } from './components/ResultsAndCoalitionsSection';
import { Footer } from './components/Footer';
import { BarChart3, MapPin, Users, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'general' | 'turnout' | 'results'>('general');

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-emerald-600/30 selection:text-emerald-200">
      {/* Top Navbar adhering to the Top Bar contract */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Quick Section Tab Switcher */}
        <div className="flex items-center justify-between gap-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-full">
            <button
              onClick={() => setActiveTab('general')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'general'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                  : 'bg-slate-950/80 text-slate-400 hover:text-emerald-300 border border-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>الإحصائيات والمقارنات</span>
            </button>

            <button
              onClick={() => setActiveTab('turnout')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'turnout'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
                  : 'bg-slate-950/80 text-slate-400 hover:text-sky-300 border border-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>خريطة نسبة المشاركة</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'results'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50'
                  : 'bg-slate-950/80 text-slate-400 hover:text-amber-300 border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>النتائج والدوائر التشريعية</span>
            </button>
          </div>
        </div>

        {/* Section View Renderer */}
        {activeTab === 'general' && <GeneralStatsSection />}
        {activeTab === 'turnout' && <TurnoutMapSection />}
        {activeTab === 'results' && <ResultsAndCoalitionsSection />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
