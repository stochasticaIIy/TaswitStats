import React, { useState, useMemo } from 'react';
import {
  PARTIES_DATA,
  COALITION_SCENARIOS,
  DISTRICT_RESULTS,
  PartyData,
  CoalitionScenario,
  DistrictResult,
  DistrictPartyResult,
} from '../data/electionData';
import { PartyLogo } from './PartyLogo';
import {
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  Filter,
  BarChart,
  ShieldAlert,
  Flame,
  UserCheck,
  TrendingUp,
  Users,
  ChevronDown,
  Edit3,
  PlusCircle,
  Save,
  X,
  RotateCcw,
} from 'lucide-react';

export const ResultsAndCoalitionsSection: React.FC = () => {
  // 1. Coalitions simulator state: Defaulting to PAM + RNI + PI (The Tripartite renewal led by PAM)
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>(['PAM', 'RNI', 'PI']);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('pam-rni-pi');

  // Custom modified district results stored in state (with localStorage persistence)
  const [customDistricts, setCustomDistricts] = useState<DistrictResult[]>(() => {
    try {
      const saved = localStorage.getItem('morocco_2026_custom_districts');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DISTRICT_RESULTS;
  });

  // District editing modal state
  const [editingDistrict, setEditingDistrict] = useState<DistrictResult | null>(null);
  const [isNewDistrict, setIsNewDistrict] = useState<boolean>(false);

  // 2. Districts Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL');
  const [selectedPartyFilter, setSelectedPartyFilter] = useState<string>('ALL');
  const [selectedMarginFilter, setSelectedMarginFilter] = useState<string>('ALL');

  // Helper formatting numbers
  const formatNumber = (num: number) => new Intl.NumberFormat('fr-MA').format(num);

  // Coalition live calculation
  const coalitionSeats = useMemo(() => {
    return selectedPartyIds.reduce((sum, partyId) => {
      const party = PARTIES_DATA.find((p) => p.id === partyId);
      return sum + (party ? party.seats2026 : 0);
    }, 0);
  }, [selectedPartyIds]);

  const majorityThreshold = 198; // 50% + 1 of 395 seats
  const isMajorityReached = coalitionSeats >= majorityThreshold;
  const majorityDelta = coalitionSeats - majorityThreshold;

  // Toggle party in coalition builder
  const toggleParty = (partyId: string) => {
    setActiveScenarioId('custom');
    if (selectedPartyIds.includes(partyId)) {
      setSelectedPartyIds(selectedPartyIds.filter((id) => id !== partyId));
    } else {
      setSelectedPartyIds([...selectedPartyIds, partyId]);
    }
  };

  // Select predefined scenario
  const applyScenario = (scenario: CoalitionScenario) => {
    setActiveScenarioId(scenario.id);
    setSelectedPartyIds(scenario.partyIds);
  };

  // Save handler for districts
  const handleSaveDistrict = (updated: DistrictResult) => {
    let newDistricts: DistrictResult[];
    if (isNewDistrict) {
      newDistricts = [updated, ...customDistricts];
    } else {
      newDistricts = customDistricts.map((d) => (d.id === updated.id ? updated : d));
    }
    setCustomDistricts(newDistricts);
    try {
      localStorage.setItem('morocco_2026_custom_districts', JSON.stringify(newDistricts));
    } catch {
      // ignore
    }
    setEditingDistrict(null);
    setIsNewDistrict(false);
  };

  const handleResetToDefaultDistricts = () => {
    if (window.confirm('هل تريد استعادة النتائج الافتراضية المدمجة؟')) {
      setCustomDistricts(DISTRICT_RESULTS);
      try {
        localStorage.removeItem('morocco_2026_custom_districts');
      } catch {
        // ignore
      }
    }
  };

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return customDistricts.filter((district) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        district.nameDarija.toLowerCase().includes(q) ||
        district.winnerCandidate.toLowerCase().includes(q) ||
        district.runnerUpCandidate.toLowerCase().includes(q) ||
        district.regionName.toLowerCase().includes(q) ||
        district.winnerPartyName.toLowerCase().includes(q) ||
        district.winnerPartyId.toLowerCase().includes(q) ||
        district.allParties.some(
          (p) =>
            p.partyName.toLowerCase().includes(q) ||
            p.partyId.toLowerCase().includes(q) ||
            p.candidateName.toLowerCase().includes(q)
        );

      const matchesRegion =
        selectedRegionFilter === 'ALL' || district.regionId === selectedRegionFilter;

      const matchesParty =
        selectedPartyFilter === 'ALL' ||
        district.winnerPartyId === selectedPartyFilter ||
        district.allParties.some((p) => p.partyId === selectedPartyFilter);

      const matchesMargin =
        selectedMarginFilter === 'ALL' || district.marginType === selectedMarginFilter;

      return matchesSearch && matchesRegion && matchesParty && matchesMargin;
    });
  }, [customDistricts, searchQuery, selectedRegionFilter, selectedPartyFilter, selectedMarginFilter]);

  // Unique regions from districts for dropdown
  const uniqueRegions = useMemo(() => {
    const map = new Map<string, string>();
    customDistricts.forEach((d) => map.set(d.regionId, d.regionName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [customDistricts]);

  return (
    <div className="space-y-8">
      {/* Header Intro */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Alexandria']">
          النتائج البرلمانية، سيناريوهات التحالفات والدوائر التشريعية
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          توزيع مقاعد مجلس النواب (395 مقعداً) وفق المحاضر الرسمية: تصدّر حزب الأصالة والمعاصرة بـ{' '}
          <strong className="text-amber-400">97 مقعداً</strong>، يليه التجمع الوطني للأحرار بـ{' '}
          <strong className="text-sky-400">66 مقعداً</strong>، وحزب الاستقلال بـ{' '}
          <strong className="text-pink-400">65 مقعداً</strong>، وحزب العدالة والتنمية بـ{' '}
          <strong className="text-emerald-400">54 مقعداً</strong>. عتبة الأغلبية الحكومية: 198 مقعداً.
        </p>
      </div>

      {/* Part 1: Chamber Seat Visual Bar & Party Rankings */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white font-['Alexandria'] flex items-center gap-2">
              <BarChart className="w-5 h-5 text-amber-400" />
              <span>توزيع مقاعد مجلس النواب (395 مقعداً)</span>
            </h3>
            <p className="text-xs text-slate-400">
              توزيع المقاعد المحصل عليها من طرف 14 حزباً سياسياً مع تحديد خط الأغلبية الحكومية (198 مقعداً)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-amber-950/50 px-3 py-1.5 rounded-lg border border-amber-800/80">
            <span className="text-slate-300">عتبة الأغلبية:</span>
            <span className="font-bold text-amber-400">198 مقعداً (50.1%)</span>
          </div>
        </div>

        {/* Visual Parliament Bar */}
        <div className="relative pt-6 pb-2">
          {/* 198 seat majority line indicator */}
          <div
            className="absolute top-0 bottom-0 border-r-2 border-dashed border-amber-400 z-10 flex flex-col items-center"
            style={{ right: '50.12%' }}
          >
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-700/80 -mt-2 shadow">
              الأغلبية 198
            </span>
          </div>

          <div className="w-full h-8 rounded-xl overflow-hidden flex bg-slate-950 border border-slate-800 shadow-inner">
            {PARTIES_DATA.map((party) => {
              const widthPct = (party.seats2026 / 395) * 100;
              return (
                <div
                  key={party.id}
                  className="h-full relative group transition-opacity hover:opacity-90 cursor-pointer"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: party.color,
                  }}
                  title={`${party.nameAr}: ${party.seats2026} مقعد (${widthPct.toFixed(1)}%)`}
                >
                  {party.seats2026 >= 20 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-sm select-none truncate px-1">
                      {party.nameAr} ({party.seats2026})
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Legend below bar */}
          <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs text-slate-400">
            {PARTIES_DATA.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                <PartyLogo code={p.code} size="xs" />
                <span className="font-medium text-slate-200">{p.nameAr}</span>
                <span className="font-mono text-white font-bold tabular-nums">({p.seats2026})</span>
              </div>
            ))}
            <span className="text-slate-500 text-[11px]">+ باقي الأحزاب الممثلة</span>
          </div>
        </div>

        {/* Party Rankings Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/90 text-xs font-semibold text-slate-400">
                <th className="py-3 px-4">الترتيب</th>
                <th className="py-3 px-4">الشعار الرسمي والحزب</th>
                <th className="py-3 px-4">الأمين العام / القيادة</th>
                <th className="py-3 px-4 font-mono">مقاعد 2026</th>
                <th className="py-3 px-4 font-mono">مقارنة بـ 2021</th>
                <th className="py-3 px-4 font-mono">النسبة (%)</th>
                <th className="py-3 px-4">الوضعية السياسية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {PARTIES_DATA.map((party, index) => {
                const diffIsPositive = party.seatsDiff >= 0;
                return (
                  <tr key={party.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">#{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <PartyLogo code={party.code} size="md" />
                        <div>
                          <span className="font-bold text-white text-sm block">{party.nameAr}</span>
                          <span className="text-xs text-slate-400">
                            رمز {party.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-300">{party.leader}</td>
                    <td className="py-3 px-4 font-mono font-bold text-sm text-white tabular-nums">
                      <span className="px-2 py-0.5 rounded font-mono font-black" style={{ color: party.color }}>
                        {party.seats2026} مقعداً
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs tabular-nums">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          diffIsPositive
                            ? 'text-emerald-400 bg-emerald-950/60'
                            : 'text-rose-400 bg-rose-950/60'
                        }`}
                      >
                        {party.seatsDiff > 0 ? `+${party.seatsDiff}` : party.seatsDiff}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs tabular-nums text-slate-300">
                      {party.votePercentage}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${
                          party.status === 'متصدر / مرشح لرئاسة الحكومة'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60 font-bold'
                            : party.status === 'حكومة سابقة'
                            ? 'bg-sky-950/80 text-sky-300 border border-sky-800/50'
                            : party.status === 'معارضة'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {party.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Interactive Coalition Builder & Scenarios */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Alexandria'] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>محاكي التحالفات وتشكيل الأغلبية الحكومية</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              طبقا للفصل 47 من الدستور، يعين الملك رئيس الحكومة من الحزب المتصدر (حزب الأصالة والمعاصرة بـ 97 مقعداً)،
              ويتطلب نيل ثقة مجلس النواب أغلبية لا تقل عن 198 مقعداً.
            </p>
          </div>

          {/* Live Majority Gauge */}
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-3.5 shrink-0 ${
              isMajorityReached
                ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-300'
                : 'bg-rose-950/60 border-rose-700/70 text-rose-300'
            }`}
          >
            {isMajorityReached ? (
              <CheckCircle className="w-7 h-7 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono tabular-nums text-white">
                  {coalitionSeats}
                </span>
                <span className="text-xs font-mono text-slate-300">/ 395 مقعداً</span>
              </div>
              <span className="text-xs font-bold block mt-0.5">
                {isMajorityReached
                  ? `أغلبية متحققة (+${majorityDelta} مقعد فوق عتبة 198)`
                  : `أقل من الأغلبية (ينقص ${Math.abs(majorityDelta)} مقعد)`}
              </span>
            </div>
          </div>
        </div>

        {/* Pre-configured Scenarios Buttons */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            سيناريوهات التحالف الممكنة:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COALITION_SCENARIOS.map((scenario) => {
              const isSelected = activeScenarioId === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => applyScenario(scenario)}
                  className={`text-right p-4 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-sm">{scenario.nameDarija}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        scenario.isViable
                          ? 'bg-emerald-900/60 text-emerald-300'
                          : 'bg-rose-900/60 text-rose-300'
                      }`}
                    >
                      {scenario.isViable ? 'أغلبية كافية (≥198)' : 'أقل من الأغلبية (<198)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{scenario.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Custom Coalition Toggle Checklist */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white">
              تركيب تحالف مخصص (حدد الأحزاب لإضافتها أو استبعادها):
            </span>
            <button
              onClick={() => {
                setSelectedPartyIds([]);
                setActiveScenarioId('custom');
              }}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              إلغاء التحديد
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {PARTIES_DATA.map((party) => {
              const isInCoalition = selectedPartyIds.includes(party.id);
              return (
                <div
                  key={party.id}
                  onClick={() => toggleParty(party.id)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all select-none ${
                    isInCoalition
                      ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <PartyLogo code={party.code} size="md" />
                    <input
                      type="checkbox"
                      checked={isInCoalition}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-0 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs font-bold text-white block mt-2">{party.nameAr}</span>
                  <div className="mt-1 text-[11px] font-mono">
                    <span className="font-bold text-white tabular-nums">{party.seats2026} مقعداً</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Part 3: Legislative Districts, Winning Candidates & Voting Margins */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Alexandria'] flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>نتائج الدوائر التشريعية، المرشحين الفائزين وفوارق الأصوات</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              بيانات الدوائر الانتخابية المحلية لـ 2026 مع إمكانية تعديل أو إضافة أي دائرة يدوياً بدقة 100%
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setIsNewDistrict(true);
                setEditingDistrict({
                  id: `district-${Date.now()}`,
                  nameDarija: '',
                  regionId: uniqueRegions[0]?.id || 'casablanca-settat',
                  regionName: uniqueRegions[0]?.name || 'الدار البيضاء - سطات',
                  totalRegistered: 150000,
                  totalVotes: 55000,
                  turnout: 36.6,
                  seats: 4,
                  winnerCandidate: '',
                  winnerPartyId: 'PAM',
                  winnerPartyName: 'حزب الأصالة والمعاصرة',
                  winnerVotes: 18000,
                  winnerVoteShare: 32.7,
                  runnerUpCandidate: '',
                  runnerUpPartyId: 'RNI',
                  runnerUpPartyName: 'التجمع الوطني للأحرار',
                  runnerUpVotes: 14000,
                  runnerUpVoteShare: 25.4,
                  marginVotes: 4000,
                  marginPercent: 7.3,
                  marginType: 'متوسط (3% - 10%)',
                  allParties: [
                    {
                      partyId: 'PAM',
                      partyName: 'حزب الأصالة والمعاصرة',
                      candidateName: '',
                      votes: 18000,
                      voteShare: 32.7,
                      isElected: true,
                      rank: 1,
                    },
                    {
                      partyId: 'RNI',
                      partyName: 'التجمع الوطني للأحرار',
                      candidateName: '',
                      votes: 14000,
                      voteShare: 25.4,
                      isElected: true,
                      rank: 2,
                    },
                    {
                      partyId: 'PI',
                      partyName: 'حزب الاستقلال',
                      candidateName: '',
                      votes: 12000,
                      voteShare: 21.8,
                      isElected: true,
                      rank: 3,
                    },
                    {
                      partyId: 'PJD',
                      partyName: 'حزب العدالة والتنمية',
                      candidateName: '',
                      votes: 9000,
                      voteShare: 16.3,
                      isElected: true,
                      rank: 4,
                    },
                  ],
                });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إضافة دائرة جديدة</span>
            </button>

            <button
              onClick={handleResetToDefaultDistricts}
              title="استعادة البيانات الأصلية"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">استعادة الأصل</span>
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          {/* Search input */}
          <div className="relative">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              بحث بالاسم أو الدائرة:
            </span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="اسم المرشح، الدائرة أو المدينة..."
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 pl-8 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Region filter */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">تصفية حسب الجهة:</span>
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
            >
              <option value="ALL">جميع الجهات</option>
              {uniqueRegions.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>

          {/* Party filter */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              تصفية حسب الحزب:
            </span>
            <select
              value={selectedPartyFilter}
              onChange={(e) => setSelectedPartyFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
            >
              <option value="ALL">جميع الأحزاب</option>
              {PARTIES_DATA.slice(0, 10).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Margin Type filter */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              طبيعة فارق الأصوات:
            </span>
            <select
              value={selectedMarginFilter}
              onChange={(e) => setSelectedMarginFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
            >
              <option value="ALL">كل الفوارق</option>
              <option value="متقارب بزاف (<3%)">متقارب جداً (&lt;3%)</option>
              <option value="متوسط (3% - 10%)">متوسط (3% - 10%)</option>
              <option value="مريح (>10%)">مريح (&gt;10%)</option>
              <option value="كاسح (>20%)">كبير (&gt;20%)</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            الدوائر المطابقة:{' '}
            <strong className="text-amber-400 font-mono tabular-nums">
              {filteredDistricts.length}
            </strong>{' '}
            دائرة تشريعية
          </span>
          {(searchQuery ||
            selectedRegionFilter !== 'ALL' ||
            selectedPartyFilter !== 'ALL' ||
            selectedMarginFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegionFilter('ALL');
                setSelectedPartyFilter('ALL');
                setSelectedMarginFilter('ALL');
              }}
              className="text-slate-400 hover:text-white underline text-xs"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        {/* District Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district) => {
              const isVeryClose = district.marginType === 'متقارب بزاف (<3%)';
              const isLandslide = district.marginType === 'كاسح (>20%)';

              return (
                <div
                  key={district.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: District Name, Region & Margin Badge */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="text-[11px] text-amber-400/80 font-medium block">
                          {district.regionName}
                        </span>
                        <h4 className="text-lg font-bold text-white font-['Alexandria'] mt-0.5">
                          دائرة {district.nameDarija}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
                          <span>
                            المقاعد:{' '}
                            <strong className="text-amber-300 font-bold">{district.seats}</strong>
                          </span>
                          <span>·</span>
                          <span>
                            نسبة المشاركة:{' '}
                            <strong className="text-emerald-400 font-bold">{district.turnout}%</strong>
                          </span>
                          <span>·</span>
                          <span>
                            الأصوات المعبر عنها:{' '}
                            <strong className="text-slate-300">
                              {formatNumber(district.totalVotes)}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-md font-bold font-mono whitespace-nowrap ${
                            isVeryClose
                              ? 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                              : isLandslide
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                              : 'bg-slate-900 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {district.marginType}
                        </span>
                        <button
                          onClick={() => {
                            setIsNewDistrict(false);
                            setEditingDistrict(JSON.parse(JSON.stringify(district)));
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-900 px-2 py-0.5 rounded border border-slate-800 transition-colors"
                          title="تعديل نتائج هذه الدائرة"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>
                      </div>
                    </div>

                    {/* All Participating Parties List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>ترتيب اللوائح المشاركة والمرشحين ({district.allParties.length} لوائح):</span>
                        </span>
                        <span className="font-mono text-[10px]">الأصوات / النسبة</span>
                      </div>

                      <div className="divide-y divide-slate-800/60 rounded-lg border border-slate-800/80 bg-slate-900/40 overflow-hidden">
                        {district.allParties.map((partyResult) => {
                          return (
                            <div
                              key={partyResult.partyId}
                              className={`p-3 transition-colors ${
                                partyResult.rank === 1
                                  ? 'bg-emerald-950/20'
                                  : partyResult.isElected
                                  ? 'bg-amber-950/10'
                                  : 'hover:bg-slate-800/30'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {/* Rank Badge */}
                                  <span
                                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-mono font-bold shrink-0 ${
                                      partyResult.rank === 1
                                        ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                                        : partyResult.isElected
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}
                                  >
                                    {partyResult.rank}
                                  </span>

                                  {/* Party Logo */}
                                  <PartyLogo code={partyResult.partyId} size="xs" />

                                  {/* Candidate & Full Party Name */}
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span
                                        className={`text-xs font-bold truncate ${
                                          partyResult.rank === 1
                                            ? 'text-emerald-300'
                                            : partyResult.isElected
                                            ? 'text-white'
                                            : 'text-slate-300'
                                        }`}
                                      >
                                        {partyResult.candidateName}
                                      </span>

                                      {partyResult.isElected && (
                                        <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold font-sans shrink-0">
                                          <CheckCircle className="w-2.5 h-2.5" />
                                          <span>فائز بمقعد</span>
                                        </span>
                                      )}
                                    </div>

                                    {/* Full Official Party Name */}
                                    <span className="text-[11px] text-slate-400 block truncate">
                                      {partyResult.partyName}
                                    </span>
                                  </div>
                                </div>

                                {/* Votes & Percentage */}
                                <div className="text-left shrink-0 font-mono">
                                  <div
                                    className={`text-xs font-bold tabular-nums ${
                                      partyResult.rank === 1
                                        ? 'text-emerald-400'
                                        : partyResult.isElected
                                        ? 'text-amber-300'
                                        : 'text-slate-300'
                                    }`}
                                  >
                                    {partyResult.voteShare}%
                                  </div>
                                  <div className="text-[11px] text-slate-400 tabular-nums">
                                    {formatNumber(partyResult.votes)} صوت
                                  </div>
                                </div>
                              </div>

                              {/* Progress bar per party */}
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                                <div
                                  className={`h-full rounded-full ${
                                    partyResult.rank === 1
                                      ? 'bg-emerald-500'
                                      : partyResult.isElected
                                      ? 'bg-amber-500'
                                      : 'bg-slate-600'
                                  }`}
                                  style={{
                                    width: `${Math.min(partyResult.voteShare * 2, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Margin Info between 1st and 2nd */}
                    <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3 text-xs flex items-center justify-between">
                      <span className="text-slate-400">
                        فارق الأصوات بين الفائز ({district.winnerPartyName}) والوصيف ({district.runnerUpPartyName}):
                      </span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums shrink-0 mr-2">
                        +{formatNumber(district.marginVotes)} صوت ({district.marginPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>إجمالي الأصوات: {formatNumber(district.totalVotes)}</span>
                    <span>المسجلون باللوائح: {formatNumber(district.totalRegistered)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 py-12 text-center bg-slate-950/60 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-400">
                لا توجد دائرة انتخابية مطابقة لمعايير البحث الحالية. يمكنك تعديل كلمات البحث أو تصفير الفلاتر.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* District Edit / Add Modal */}
      {editingDistrict && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {isNewDistrict ? 'إضافة دائرة انتخابية جديدة' : `تعديل نتائج: دائرة ${editingDistrict.nameDarija}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingDistrict(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">اسم الدائرة (بالعربية):</label>
                <input
                  type="text"
                  value={editingDistrict.nameDarija}
                  onChange={(e) =>
                    setEditingDistrict({ ...editingDistrict, nameDarija: e.target.value })
                  }
                  placeholder="مثال: الدار البيضاء - أنفا"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">الجهة:</label>
                <select
                  value={editingDistrict.regionId}
                  onChange={(e) => {
                    const found = uniqueRegions.find((r) => r.id === e.target.value);
                    setEditingDistrict({
                      ...editingDistrict,
                      regionId: e.target.value,
                      regionName: found ? found.name : editingDistrict.regionName,
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  {uniqueRegions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">عدد المقاعد المخصصة:</label>
                <input
                  type="number"
                  value={editingDistrict.seats}
                  onChange={(e) =>
                    setEditingDistrict({ ...editingDistrict, seats: parseInt(e.target.value) || 1 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">نسبة المشاركة (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingDistrict.turnout}
                  onChange={(e) =>
                    setEditingDistrict({
                      ...editingDistrict,
                      turnout: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Candidates / Parties List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300">
                  قوائم الأحزاب والمرشحين الفائزين:
                </span>
                <button
                  onClick={() => {
                    const newParty: DistrictPartyResult = {
                      partyId: 'PAM',
                      partyName: 'حزب الأصالة والمعاصرة',
                      candidateName: '',
                      votes: 5000,
                      voteShare: 10,
                      isElected: false,
                      rank: editingDistrict.allParties.length + 1,
                    };
                    setEditingDistrict({
                      ...editingDistrict,
                      allParties: [...editingDistrict.allParties, newParty],
                    });
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>إضافة حزب/مرشح</span>
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {editingDistrict.allParties.map((party, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-xs"
                  >
                    <div className="sm:col-span-1">
                      <select
                        value={party.partyId}
                        onChange={(e) => {
                          const pObj = PARTIES_DATA.find((p) => p.id === e.target.value);
                          const updated = [...editingDistrict.allParties];
                          updated[pIdx].partyId = e.target.value;
                          if (pObj) updated[pIdx].partyName = pObj.nameAr;
                          setEditingDistrict({ ...editingDistrict, allParties: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      >
                        {PARTIES_DATA.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="اسم المرشح (وكيل اللائحة)..."
                        value={party.candidateName}
                        onChange={(e) => {
                          const updated = [...editingDistrict.allParties];
                          updated[pIdx].candidateName = e.target.value;
                          setEditingDistrict({ ...editingDistrict, allParties: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>

                    <div className="flex items-center gap-1 sm:col-span-1">
                      <input
                        type="number"
                        placeholder="الأصوات"
                        value={party.votes}
                        onChange={(e) => {
                          const updated = [...editingDistrict.allParties];
                          updated[pIdx].votes = parseInt(e.target.value) || 0;
                          setEditingDistrict({ ...editingDistrict, allParties: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between sm:col-span-1 gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={party.isElected}
                          onChange={(e) => {
                            const updated = [...editingDistrict.allParties];
                            updated[pIdx].isElected = e.target.checked;
                            setEditingDistrict({ ...editingDistrict, allParties: updated });
                          }}
                          className="rounded text-amber-500"
                        />
                        <span className="text-[11px] text-slate-300">فاز؟</span>
                      </label>

                      <button
                        onClick={() => {
                          const updated = editingDistrict.allParties.filter((_, i) => i !== pIdx);
                          setEditingDistrict({ ...editingDistrict, allParties: updated });
                        }}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="حذف هذا المرشح"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setEditingDistrict(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!editingDistrict.nameDarija.trim()) {
                    alert('يرجى إدخال اسم الدائرة');
                    return;
                  }
                  // Sort parties by votes
                  const sorted = [...editingDistrict.allParties].sort((a, b) => b.votes - a.votes);
                  sorted.forEach((p, idx) => {
                    p.rank = idx + 1;
                  });
                  const first = sorted[0];
                  const second = sorted[1];
                  const totalV = sorted.reduce((sum, p) => sum + p.votes, 0) || editingDistrict.totalVotes;
                  sorted.forEach((p) => {
                    p.voteShare = totalV > 0 ? +((p.votes / totalV) * 100).toFixed(2) : 0;
                  });

                  const marginV = first && second ? first.votes - second.votes : 0;
                  const marginP = first && second && totalV > 0 ? +((marginV / totalV) * 100).toFixed(1) : 0;

                  const finalized: DistrictResult = {
                    ...editingDistrict,
                    totalVotes: totalV,
                    winnerCandidate: first ? first.candidateName : 'غير محدد',
                    winnerPartyId: first ? first.partyId : 'PAM',
                    winnerPartyName: first ? first.partyName : 'حزب الأصالة والمعاصرة',
                    winnerVotes: first ? first.votes : 0,
                    winnerVoteShare: first ? first.voteShare : 0,
                    runnerUpCandidate: second ? second.candidateName : 'غير محدد',
                    runnerUpPartyId: second ? second.partyId : 'RNI',
                    runnerUpPartyName: second ? second.partyName : 'التجمع الوطني للأحرار',
                    runnerUpVotes: second ? second.votes : 0,
                    runnerUpVoteShare: second ? second.voteShare : 0,
                    marginVotes: marginV,
                    marginPercent: marginP,
                    allParties: sorted,
                  };
                  handleSaveDistrict(finalized);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>حفظ النتائج المؤكدة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
