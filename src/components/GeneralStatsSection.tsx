import React, { useState } from 'react';
import { HISTORICAL_STATS, INTRADAY_TURNOUT, DEMOGRAPHICS_DATA } from '../data/electionData';
import { PartyLogo } from './PartyLogo';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Vote,
  Clock,
  Award,
  Layers,
  FileText,
  UserCheck,
  Building,
  CheckCircle2,
  Shield,
  PieChart,
  User,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const GeneralStatsSection: React.FC = () => {
  const [selectedComparisonYear, setSelectedComparisonYear] = useState<number>(2021);
  const [activeDemographicTab, setActiveDemographicTab] = useState<'age' | 'gender' | 'environment' | 'overview'>('age');
  const currentOfficial = HISTORICAL_STATS[0]; // 2026: 15,801,162 registered, 38.02% turnout, 97 seats PAM
  const comparisonYearData =
    HISTORICAL_STATS.find((s) => s.year === selectedComparisonYear) || HISTORICAL_STATS[1];

  // Helper formatting numbers with Moroccan / French spacing
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-MA').format(num);
  };

  // Turnout difference vs comparison year
  const turnoutDiff = +(currentOfficial.voterTurnout - comparisonYearData.voterTurnout).toFixed(2);
  const registeredDiff = +(
    ((currentOfficial.registeredVoters - comparisonYearData.registeredVoters) /
      comparisonYearData.registeredVoters) *
    100
  ).toFixed(1);
  const spoiledDiff = +(
    currentOfficial.spoiledVotesRate - comparisonYearData.spoiledVotesRate
  ).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Alexandria']">
              المؤشرات العامة لانتخابات مجلس النواب 2026
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              النتائج الرسمية لانتخابات أعضاء مجلس النواب (395 مقعداً): نسبة المشاركة الوطنية{' '}
              <strong className="text-emerald-400">38.02%</strong> (6,007,602 مصوت)، تصدّر{' '}
              <strong className="text-amber-400">حزب الأصالة والمعاصرة بـ 97 مقعداً</strong>، وتنافس 28 حزباً سياسياً.
            </p>
          </div>

          {/* Selector for comparison */}
          <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl flex flex-col gap-2 shrink-0 shadow-lg">
            <span className="text-xs text-slate-400 font-medium">مقارنة مع استحقاقات:</span>
            <div className="flex gap-2">
              {[2021, 2016, 2011].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedComparisonYear(year)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedComparisonYear === year
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Nationwide Turnout */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">نسبة المشاركة الوطنية</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono tracking-tight text-white tabular-nums">
              {currentOfficial.voterTurnout}%
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border ${
                turnoutDiff >= 0
                  ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
                  : 'text-rose-400 bg-rose-950/80 border-rose-800'
              }`}
            >
              {turnoutDiff >= 0 ? `+${turnoutDiff}` : turnoutDiff}% vs {selectedComparisonYear}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            مقابل {comparisonYearData.voterTurnout}% المسجلة في اقتراع {selectedComparisonYear}.
          </p>
        </div>

        {/* KPI 2: Registered Voters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">الكتلة الناخبة المسجلة</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tracking-tight text-white tabular-nums">
              {formatNumber(currentOfficial.registeredVoters)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            أدلى منهم {formatNumber(currentOfficial.votesCast)} ناخب بأصواتهم.
          </p>
        </div>

        {/* KPI 3: Parliamentary Winner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">الحزب المتصدر في البرلمان</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2.5">
              <PartyLogo code="PAM" size="md" />
              <div>
                <span className="text-sm font-bold text-white block">حزب الأصالة والمعاصرة</span>
                <span className="text-xs text-slate-400 font-mono">المرتبة الأولى</span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-amber-400">97 مقعداً</span>
              <span className="text-xs text-slate-400">(+11 عن 2021)</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Spoiled Votes & Stations */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">مكاتب التصويت والأصوات الملغاة</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Vote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tracking-tight text-white tabular-nums">
              {formatNumber(currentOfficial.votingStations)}
            </span>
            <span className="text-xs text-slate-400">مكتب تصويت</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span>نسبة الأصوات الملغاة:</span>
            <span className="font-mono font-bold text-amber-400">{currentOfficial.spoiledVotesRate}%</span>
          </div>
        </div>
      </div>

      {/* Intraday Turnout Timeline */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white font-['Alexandria']">
            تطور نسبة المشاركة الوطنية خلال يوم الاقتراع
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {INTRADAY_TURNOUT.map((checkpoint, index) => {
            const isFinal = index === INTRADAY_TURNOUT.length - 1;
            return (
              <div
                key={checkpoint.time}
                className={`p-3 rounded-xl border text-right ${
                  isFinal
                    ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-300'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300'
                }`}
              >
                <span className="text-[11px] font-mono text-slate-400 block">{checkpoint.time}</span>
                <span className="text-xl font-black font-mono text-white block mt-1 tabular-nums">
                  {checkpoint.rate}%
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{checkpoint.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demographic Breakdown Section (Age, Sex, Demographics, Urban/Rural) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Alexandria']">
                التركيبة الديمغرافية للهيئة الناخبة (الفئات العمرية، الجنس، والوسط)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                توزيع الكتلة الناخبة الرسمية البالغة {formatNumber(DEMOGRAPHICS_DATA.electoralBaseOverview.registeredVoters)} ناخباً وفق سجلات وزارة الداخلية
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveDemographicTab('age')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDemographicTab === 'age'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>الفئات العمرية</span>
            </button>
            <button
              onClick={() => setActiveDemographicTab('gender')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDemographicTab === 'gender'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>حسب الجنس (ذكور / إناث)</span>
            </button>
            <button
              onClick={() => setActiveDemographicTab('environment')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDemographicTab === 'environment'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>حضري / قروي</span>
            </button>
            <button
              onClick={() => setActiveDemographicTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeDemographicTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>الكتلة المؤهلة للتصويت</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Breakdown by Age Group */}
        {activeDemographicTab === 'age' && (
          <div className="space-y-6">
            {/* Visual Bar Distribution */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>توزيع المسجلين حسب الشرائح السنية</span>
                <span className="font-mono">المجموع: 100%</span>
              </div>
              <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner bg-slate-950 p-0.5 border border-slate-800">
                {DEMOGRAPHICS_DATA.byAgeGroup.map((item) => (
                  <div
                    key={item.id}
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    className="h-full first:rounded-r-lg last:rounded-l-lg transition-all duration-300 hover:opacity-90 relative group"
                    title={`${item.label}: ${item.percentage}% (${formatNumber(item.registeredCount)} ناخب)`}
                  />
                ))}
              </div>
            </div>

            {/* Detailed Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEMOGRAPHICS_DATA.byAgeGroup.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-bold text-white text-sm">{item.label}</span>
                      </div>
                      <span
                        className="text-sm font-black font-mono px-2 py-0.5 rounded"
                        style={{ color: item.color, backgroundColor: `${item.color}15` }}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">عدد المسجلين:</span>
                    <span className="font-mono font-bold text-slate-200 tabular-nums">
                      {formatNumber(item.registeredCount)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">نسبة الإقبال التقديرية:</span>
                    <span className="font-mono font-bold text-emerald-400 tabular-nums">
                      {item.turnoutRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Context Note */}
            <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5 text-xs text-slate-400 leading-relaxed flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0">ملاحظة تحليلية:</span>
              <span>
                تُظهر معطيات المراجعة الاستثنائية للوائح الانتخابية هيمنة الفئات فوق 45 سنة (حوالي 60% من الكتلة الناخبة الإجمالية)، بينما لا تتعدى نسبة الشباب بين 18 و24 سنة 4%، مما يعكس الحاجة المتواصلة لتعزيز آليات استقطاب وتسجيل الأجيال الصاعدة.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Breakdown by Gender */}
        {activeDemographicTab === 'gender' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMOGRAPHICS_DATA.byGender.map((gender) => (
                <div
                  key={gender.id}
                  className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
                >
                  <div
                    className="absolute top-0 right-0 w-2 h-full"
                    style={{ backgroundColor: gender.color }}
                  />
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                          style={{ backgroundColor: `${gender.color}20`, color: gender.color }}
                        >
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{gender.label}</h3>
                          <span className="text-xs text-slate-400">السجلات الرسمية</span>
                        </div>
                      </div>
                      <span
                        className="text-3xl font-black font-mono tracking-tight"
                        style={{ color: gender.color }}
                      >
                        {gender.percentage}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                      {gender.description}
                    </p>

                    {/* Progress representation */}
                    <div className="mt-4 h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${gender.percentage}%`, backgroundColor: gender.color }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">إجمالي المسجلين في اللوائح:</span>
                      <span className="font-mono font-bold text-white tabular-nums">
                        {formatNumber(gender.registeredCount)} ناخب
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">نسبة التصويت التقديرية:</span>
                      <span className="font-mono font-bold text-emerald-400 tabular-nums">
                        {gender.turnoutRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">الأصوات المدلى بها المقدرة:</span>
                      <span className="font-mono font-bold text-slate-200 tabular-nums">
                        {formatNumber(gender.votesEstimated || 0)} صوت
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Women's Representation in Parliament */}
            <div className="bg-gradient-to-r from-pink-950/30 to-purple-950/30 border border-pink-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-pink-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">التمثيلية النسائية بمجلس النواب 2026</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    92 مقعداً تشريعياً ظفرت به النساء (23.3% من مجموع مقاعد مجلس النواب البالغة 395) عبر اللوائح الجهوية النسائية والدوائر المحلية.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 shrink-0">
                92 / 395 نائبة
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Breakdown by Urban vs Rural Environment */}
        {activeDemographicTab === 'environment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMOGRAPHICS_DATA.byEnvironment.map((env) => (
                <div
                  key={env.id}
                  className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
                >
                  <div
                    className="absolute top-0 right-0 w-2 h-full"
                    style={{ backgroundColor: env.color }}
                  />
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                          style={{ backgroundColor: `${env.color}20`, color: env.color }}
                        >
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{env.label}</h3>
                          <span className="text-xs text-slate-400">التوزيع الجغرافي للناخبين</span>
                        </div>
                      </div>
                      <span
                        className="text-3xl font-black font-mono tracking-tight"
                        style={{ color: env.color }}
                      >
                        {env.percentage}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                      {env.description}
                    </p>

                    <div className="mt-4 h-2.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${env.percentage}%`, backgroundColor: env.color }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">عدد المسجلين في اللوائح:</span>
                      <span className="font-mono font-bold text-white tabular-nums">
                        {formatNumber(env.registeredCount)} ناخب
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">نسبة المشاركة في الوسط:</span>
                      <span
                        className={`font-mono font-bold tabular-nums ${
                          env.id === 'rural' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {env.turnoutRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">الأصوات المدلى بها المقدرة:</span>
                      <span className="font-mono font-bold text-slate-200 tabular-nums">
                        {formatNumber(env.votesEstimated || 0)} صوت
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
              <span className="text-indigo-400 font-bold block mb-1">المفارقة الحضرية القروية:</span>
              رغم أن الوسط الحضري يستأثر بـ 55% من الكتلة الناخبة، إلا أن نسبة المشاركة بالوسط القروي بلغت حوالي 45.6% مقارنة بـ 31.8% في المدن الكبرى كـ الدار البيضاء، الرباط وفاس، مما منح المقاعد القروية وزناً حاسماً في ترجيح موازين القوى البرلمانية.
            </div>
          </div>
        )}

        {/* Tab 4: Eligible Moroccan Population Overview */}
        {activeDemographicTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block">المغاربة البالغون سن التصويت (18+)</span>
                <span className="text-2xl font-black font-mono text-white block mt-2 tabular-nums">
                  ~28,000,000
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">تقديرات المندوبية السامية للتخطيط</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block">المسجلون في اللوائح الانتخابية</span>
                <span className="text-2xl font-black font-mono text-emerald-400 block mt-2 tabular-nums">
                  {formatNumber(DEMOGRAPHICS_DATA.electoralBaseOverview.registeredVoters)}
                </span>
                <span className="text-[11px] text-emerald-500 mt-1 block">
                  {DEMOGRAPHICS_DATA.electoralBaseOverview.registrationRate}% من المؤهلين
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block">غير المسجلين في اللوائح</span>
                <span className="text-2xl font-black font-mono text-amber-400 block mt-2 tabular-nums">
                  {formatNumber(DEMOGRAPHICS_DATA.electoralBaseOverview.unregisteredEligible)}
                </span>
                <span className="text-[11px] text-amber-500 mt-1 block">43.57% من المواطنين البالغين</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs text-slate-400 block">المصوتون الفعليون في الاقتراع</span>
                <span className="text-2xl font-black font-mono text-sky-400 block mt-2 tabular-nums">
                  {formatNumber(DEMOGRAPHICS_DATA.electoralBaseOverview.actualVoters)}
                </span>
                <span className="text-[11px] text-sky-500 mt-1 block">
                  38.02% من المسجلين / 21.45% من البالغين
                </span>
              </div>
            </div>

            {/* Visual Funnel */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white">مسار الهيئة الناخبة (من الأهلية إلى صندوق الاقتراع)</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>مجموع المواطنين البالغين سن الرشد الانتخابي بالمغرب</span>
                    <span className="font-mono text-white">28 مليون نسمة (100%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>المقيدون باللوائح الانتخابية العامة (وزارة الداخلية)</span>
                    <span className="font-mono text-emerald-400">15.80 مليون ناخب (56.4%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[56.4%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>المصوتون الفعليون الذين أدلوا بأصواتهم يوم 23 شتنبر 2026</span>
                    <span className="font-mono text-sky-400">6.01 مليون مصوت (21.4% من البالغين / 38.02% من المسجلين)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full w-[21.4%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Parliamentary Distribution Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Building className="w-4 h-4 text-sky-400" />
            <span>الدوائر التشريعية</span>
          </div>
          <div className="text-xs text-slate-300 space-y-1">
            <p>92 دائرة تشريعية محلية (305 مقاعد)</p>
            <p>12 دائرة جهوية نسائية (90 مقعداً)</p>
            <p className="font-bold text-white pt-1">المجموع: 395 مقعداً برلمانياً</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>تمثيلية النساء والشباب</span>
          </div>
          <div className="text-xs text-slate-300 space-y-1">
            <p>مقاعد النساء: {currentOfficial.womenSeats} مقعداً (23.3%)</p>
            <p>مقاعد الشباب: {currentOfficial.youthSeats} نائباً (14.7%)</p>
            <p className="text-slate-400 pt-1">ضمن اللوائح الجهوية والمحلية</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>المشاركة الحزبية</span>
          </div>
          <div className="text-xs text-slate-300 space-y-1">
            <p>28 حزباً سياسياً مشاركاً</p>
            <p>14 حزباً حصلت على مقاعد في البرلمان</p>
            <p className="text-slate-400 pt-1">عتبة الأغلبية الحكومية: 198 مقعداً</p>
          </div>
        </div>
      </div>

      {/* Multi-Year Comparison Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <h2 className="text-sm sm:text-base font-bold text-white font-['Alexandria']">
            مقارنة المؤشرات الانتخابية عبر الاستحقاقات التشريعية (2026 - 2021 - 2016 - 2011)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold text-slate-400">
                <th className="py-3 px-4">المؤشر</th>
                <th className="py-3 px-3 text-emerald-400 font-bold font-mono">2026</th>
                <th className="py-3 px-3 font-mono text-slate-300">2021</th>
                <th className="py-3 px-3 font-mono text-slate-400">2016</th>
                <th className="py-3 px-3 font-mono text-slate-400">2011</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-medium">نسبة المشاركة الوطنية (%)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 tabular-nums">38.02%</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-300">50.35%</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">42.29%</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">45.40%</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-medium">الكتلة الناخبة المسجلة</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 tabular-nums">15,801,162</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-300">17,509,127</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">15,702,592</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">13,424,160</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-medium">المصوتون الفعليون</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 tabular-nums">6,007,602</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-300">8,815,800</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">6,640,626</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">6,094,568</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-medium">الحزب المتصدر في البرلمان</td>
                <td className="py-2.5 px-3 font-bold text-amber-400">حزب الأصالة والمعاصرة (97)</td>
                <td className="py-2.5 px-3 text-sky-400">التجمع الوطني للأحرار (102)</td>
                <td className="py-2.5 px-3 text-emerald-400">حزب العدالة والتنمية (125)</td>
                <td className="py-2.5 px-3 text-emerald-400">حزب العدالة والتنمية (107)</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-medium">مقاعد النساء</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 tabular-nums">92</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-300">95</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">81</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">67</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-medium">مكاتب التصويت</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 tabular-nums">41,200</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-300">40,249</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">39,000</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">38,200</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-medium">نسبة الأصوات الملغاة</td>
                <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 tabular-nums">9.4%</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-300">8.2%</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">11.4%</td>
                <td className="py-2.5 px-3 font-mono tabular-nums text-slate-400">14.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
