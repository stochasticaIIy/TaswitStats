import React, { useState, useEffect, useRef } from 'react';
import { REGIONS_DATA, TURNOUT_TIMELINE, RegionData } from '../data/electionData';
import { PartyLogo, getPartyFullName } from './PartyLogo';
import {
  MapPin,
  TrendingDown,
  Building2,
  Search,
  CheckCircle2,
  Maximize2,
  Layers,
  RotateCcw,
  Info,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mapping between GeoJSON nom_region and our REGIONS_DATA IDs
const GEOJSON_NAME_TO_REGION_ID: Record<string, string> = {
  'Oriental': 'oriental',
  'Tanger-Tétouan-Al Hoceima': 'tanger-tetouan-al-hoceima',
  'Guelmim-Oued Noun': 'guelmim-oued-noun',
  'Eddakhla-Oued Eddahab': 'dakhla-oued-ed-dahab',
  'Béni Mellal-Khénifra': 'beni-mellal-khenifra',
  'Drâa-Tafilalet': 'draa-tafilalet',
  'Marrakech-Safi': 'marrakech-safi',
  'Grand Casablanca-Settat': 'casablanca-settat',
  'Fés-Meknés': 'fes-meknes',
  'Laayoune-Sakia El Hamra': 'laayoune-sakia-el-hamra',
  'Rabat-Salé-Kénitra': 'rabat-sale-kenitra',
  'Souss-Massa': 'souss-massa',
};

// Regional coordinates for map markers and centering [lat, lng]
const REGION_CENTROIDS: Record<string, [number, number]> = {
  'tanger-tetouan-al-hoceima': [35.45, -5.35],
  'oriental': [33.8, -2.5],
  'fes-meknes': [33.95, -4.75],
  'rabat-sale-kenitra': [34.15, -6.4],
  'beni-mellal-khenifra': [32.45, -6.3],
  'casablanca-settat': [33.25, -7.6],
  'marrakech-safi': [31.65, -8.6],
  'draa-tafilalet': [31.5, -5.2],
  'souss-massa': [30.15, -8.9],
  'guelmim-oued-noun': [28.6, -9.9],
  'laayoune-sakia-el-hamra': [26.7, -12.3],
  'dakhla-oued-ed-dahab': [23.4, -14.8],
};

export const TurnoutMapSection: React.FC = () => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('casablanca-settat');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const selectedRegion = REGIONS_DATA.find((r) => r.id === selectedRegionId) || REGIONS_DATA[0];
  const hoveredRegion = hoveredRegionId ? REGIONS_DATA.find((r) => r.id === hoveredRegionId) : null;
  const activeDisplayRegion = hoveredRegion || selectedRegion;

  // Format numbers
  const formatNumber = (num: number) => new Intl.NumberFormat('fr-MA').format(num);

  // Color generator for turnout level
  const getTurnoutColor = (turnout: number) => {
    if (turnout >= 60) return '#059669'; // High emerald
    if (turnout >= 50) return '#0d9488'; // Teal
    if (turnout >= 40) return '#0284c7'; // Sky
    if (turnout >= 35) return '#d97706'; // Amber
    return '#475569'; // Slate
  };

  // Filter cities
  const allFilteredCities = citySearchQuery.trim()
    ? REGIONS_DATA.flatMap((reg) =>
        reg.cities
          .filter((c) => c.name.toLowerCase().includes(citySearchQuery.trim().toLowerCase()))
          .map((c) => ({ ...c, regionName: reg.nameDarija, regionId: reg.id }))
      )
    : [];

  // Sort regions descending by turnout
  const sortedRegionsByTurnout = [...REGIONS_DATA].sort((a, b) => b.turnout - a.turnout);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center Morocco: covers North (Tangier) to South (Dakhla / Lagouira)
    const map = L.map(mapContainerRef.current, {
      center: [28.8, -9.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 11,
      scrollWheelZoom: false, // Prevents zooming when mouse scrolls over map
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Add Esri World Dark Gray Basemap (Completely free, no API key, clean dark cartography)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 16,
        attribution: 'Esri',
      }
    ).addTo(map);

    // Optional reference layer for cities & oceans labels
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 16,
      }
    ).addTo(map);

    // Zoom buttons top-right
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map);

    // Markers layer group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Load Moroccan GeoJSON
    fetch('/morocco-regions-simple.geojson')
      .then((res) => res.json())
      .then((geoData) => {
        const geoLayer = L.geoJSON(geoData, {
          style: (feature) => {
            const nomRegion = feature?.properties?.nom_region || '';
            const regId = GEOJSON_NAME_TO_REGION_ID[nomRegion];
            const regInfo = REGIONS_DATA.find((r) => r.id === regId);
            const turnout = regInfo ? regInfo.turnout : 38.0;
            const isSelected = regId === selectedRegionId;

            return {
              fillColor: getTurnoutColor(turnout),
              weight: isSelected ? 3 : 1.5,
              opacity: 1,
              color: isSelected ? '#34d399' : '#1e293b',
              fillOpacity: isSelected ? 0.75 : 0.45,
            };
          },
          onEachFeature: (feature, layer) => {
            const nomRegion = feature?.properties?.nom_region || '';
            const regId = GEOJSON_NAME_TO_REGION_ID[nomRegion];
            const regInfo = REGIONS_DATA.find((r) => r.id === regId);

            if (regInfo) {
              // Tooltip popup
              layer.bindTooltip(
                `<div style="text-align: right; font-family: 'Alexandria', sans-serif; direction: rtl;">
                  <strong style="font-size: 13px; color: #fff;">${regInfo.nameDarija}</strong><br/>
                  <span style="color: #34d399; font-weight: bold; font-size: 14px;">${regInfo.turnout}%</span> 
                  <span style="color: #94a3b8; font-size: 11px;">(مشاركة 2026)</span><br/>
                  <span style="color: #cbd5e1; font-size: 11px;">المسجلين: ${new Intl.NumberFormat('fr-MA').format(regInfo.registeredVoters)}</span>
                </div>`,
                {
                  sticky: true,
                  className: 'bg-slate-900 border border-slate-700 text-white rounded-xl shadow-xl p-2.5',
                }
              );

              layer.on({
                mouseover: (e) => {
                  setHoveredRegionId(regId);
                  const targetLayer = e.target;
                  targetLayer.setStyle({
                    weight: 2.8,
                    color: '#6ee7b7',
                    fillOpacity: 0.8,
                  });
                  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    targetLayer.bringToFront();
                  }
                },
                mouseout: (e) => {
                  setHoveredRegionId(null);
                  if (geojsonLayerRef.current) {
                    geojsonLayerRef.current.resetStyle(e.target);
                    // Reapply selected style if this was the selected layer
                    if (regId === selectedRegionId) {
                      e.target.setStyle({
                        weight: 3,
                        color: '#34d399',
                        fillOpacity: 0.75,
                      });
                    }
                  }
                },
                click: () => {
                  setSelectedRegionId(regId);
                  // Smoothly pan to region centroid
                  const center = REGION_CENTROIDS[regId];
                  if (center && mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo(center, Math.max(mapInstanceRef.current.getZoom(), 6), {
                      duration: 0.8,
                    });
                  }
                },
              });
            }
          },
        }).addTo(map);

        geojsonLayerRef.current = geoLayer;

        // Add badges/markers on centroids
        REGIONS_DATA.forEach((reg) => {
          const center = REGION_CENTROIDS[reg.id];
          if (!center) return;

          const markerHtml = `
            <div class="cursor-pointer group flex flex-col items-center">
              <div class="px-2 py-0.5 rounded-full text-[10px] font-mono font-black shadow-lg transition-transform group-hover:scale-110 flex items-center gap-1"
                   style="background-color: ${getTurnoutColor(reg.turnout)}; color: #fff; border: 1.5px solid rgba(255,255,255,0.7);">
                <span>${reg.turnout}%</span>
              </div>
              <span class="text-[10px] font-bold text-white bg-slate-950/80 px-1.5 py-0.2 rounded mt-0.5 whitespace-nowrap shadow border border-slate-800">
                ${reg.capitalCity}
              </span>
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-region-marker',
            iconSize: [60, 36],
            iconAnchor: [30, 18],
          });

          const marker = L.marker(center, { icon: customIcon }).addTo(markersGroup);
          marker.on('click', () => {
            setSelectedRegionId(reg.id);
            map.flyTo(center, 7, { duration: 0.8 });
          });
        });

        setMapLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load Morocco GeoJSON:', err);
      });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update styles when selectedRegionId changes
  useEffect(() => {
    if (!geojsonLayerRef.current) return;

    geojsonLayerRef.current.eachLayer((layer: any) => {
      const nomRegion = layer.feature?.properties?.nom_region || '';
      const regId = GEOJSON_NAME_TO_REGION_ID[nomRegion];
      const regInfo = REGIONS_DATA.find((r) => r.id === regId);
      const isSelected = regId === selectedRegionId;
      const turnout = regInfo ? regInfo.turnout : 38.0;

      layer.setStyle({
        fillColor: getTurnoutColor(turnout),
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        color: isSelected ? '#34d399' : '#1e293b',
        fillOpacity: isSelected ? 0.75 : 0.45,
      });

      if (isSelected && layer.bringToFront) {
        layer.bringToFront();
      }
    });
  }, [selectedRegionId]);

  // Reset Map View to default Morocco framing
  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([28.8, -9.5], 5, { duration: 0.8 });
    }
  };

  // Center on specific region
  const handleSelectRegion = (regId: string) => {
    setSelectedRegionId(regId);
    const center = REGION_CENTROIDS[regId];
    if (center && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, 6.5, { duration: 0.8 });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Introduction */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Alexandria']">
          نسب المشاركة حسب جهات ومدن المملكة
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          الخريطة التفاعلية للمملكة المغربية بجهاتها الـ12. استعرض نسبة المشاركة، الكتلة الناخبة، وعدد المقاعد لكل جهة ومدينة.
        </p>
      </div>

      {/* Main Map & Regional Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Authentic Interactive Geographic Map (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative hover:border-sky-900/40 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>الخريطة الجغرافية التفاعلية</span>
              </h3>
              <span className="text-xs text-slate-400">
                انقر على أي جهة لمعاينة بياناتها ومدنها
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetMap}
                className="flex items-center gap-1 text-xs bg-slate-950 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-sky-700/60 transition-colors"
                title="إعادة ضبط زاوية الرؤية"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>المملكة كاملة</span>
              </button>
              <div className="flex items-center gap-2 text-xs bg-sky-950/60 px-3 py-1.5 rounded-lg border border-sky-800/80">
                <span className="text-slate-300">المعدل الوطني 2026:</span>
                <span className="font-mono font-bold text-sky-400 tabular-nums">38.02%</span>
              </div>
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div className="relative w-full h-[540px] sm:h-[620px] bg-[#070b12] rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Quick Legend at bottom right */}
            <div className="absolute bottom-3 right-3 z-10 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-[11px] space-y-1 shadow-md backdrop-blur-sm pointer-events-none">
              <span className="text-slate-400 font-bold block mb-1">دليل نسب المشاركة:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#059669]"></span>
                <span className="text-slate-300 font-mono">&gt; 55% (الأقاليم الجنوبية)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#0d9488]"></span>
                <span className="text-slate-300 font-mono">45% - 55% (كلميم والأطلس)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#0284c7]"></span>
                <span className="text-slate-300 font-mono">38% - 45% (الشمال والشرق)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#475569]"></span>
                <span className="text-slate-300 font-mono">&lt; 35% (الدار البيضاء والرباط)</span>
              </div>
            </div>

            {/* Subtle Map hint */}
            <div className="absolute top-3 left-3 z-10 bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1 pointer-events-none">
              <Info className="w-3 h-3 text-emerald-400" />
              <span>خريطة جغرافية حقيقية 100% مدعومة بنظام الإحداثيات الرسمي</span>
            </div>
          </div>
        </div>

        {/* Right: Region Details & City List (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Region Header Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">الجهة المختارة:</span>
                <h3 className="text-xl font-extrabold text-white font-['Alexandria']">
                  {activeDisplayRegion.nameDarija}
                </h3>
                <span className="text-xs text-slate-400 block mt-0.5">
                  العاصمة الإدارية: <strong>{activeDisplayRegion.capitalCity}</strong> ({activeDisplayRegion.nameFrench})
                </span>
              </div>
              <div className="text-left">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tabular-nums">
                  {activeDisplayRegion.turnout}%
                </span>
                <span className="text-[11px] block font-mono text-rose-400 font-semibold">
                  {activeDisplayRegion.turnoutChange}% vs 2021
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-center">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/70">
                <span className="text-[10px] text-slate-400 block">المسجلين</span>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {formatNumber(activeDisplayRegion.registeredVoters)}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/70">
                <span className="text-[10px] text-slate-400 block">المصوتين</span>
                <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                  {formatNumber(activeDisplayRegion.votesCast)}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/70">
                <span className="text-[10px] text-slate-400 block">المقاعد البرلمانية</span>
                <span className="text-xs font-mono font-bold text-sky-400 tabular-nums">
                  {activeDisplayRegion.totalSeats} مقعداً
                </span>
              </div>
            </div>

            {/* Leading Party in Region */}
            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">الحزب المتصدر بالجهة:</span>
              <div className="flex items-center gap-2.5">
                <PartyLogo code={activeDisplayRegion.leadingParty} size="md" />
                <span className="text-xs font-bold text-white">
                  {getPartyFullName(activeDisplayRegion.leadingParty)}
                </span>
              </div>
            </div>
          </div>

          {/* Cities & Districts within the active region */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>نسبة المشاركة بالمدن التابعة لجهة {activeDisplayRegion.nameDarija}</span>
              </h4>
            </div>

            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {activeDisplayRegion.cities.map((city) => (
                <div
                  key={city.name}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{city.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                      <span>المسجلين: {formatNumber(city.registered)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <span>المتصدر:</span>
                        <PartyLogo code={city.leadingParty} size="xs" />
                        <strong className="text-slate-200 font-bold">
                          {getPartyFullName(city.leadingParty)}
                        </strong>
                      </span>
                    </span>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-sm font-black text-emerald-400 tabular-nums">
                      {city.turnout}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Region Quick Select List (All 12 Regions) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">ترتيب الجهات الـ12 حسب نسبة المشاركة:</span>
              <span className="text-[10px] text-slate-400">انقر لتحديد الجهة والخريطة</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
              {sortedRegionsByTurnout.map((region) => {
                const isSelected = region.id === selectedRegionId;
                return (
                  <button
                    key={region.id}
                    onClick={() => handleSelectRegion(region.id)}
                    className={`text-right p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800/70 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate max-w-[120px]">{region.nameDarija}</span>
                    <span className="font-mono text-[11px] text-emerald-400 font-bold tabular-nums">
                      {region.turnout}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search any city across Morocco */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>بحث عن نسبة مشاركة أي مدينة مغربية:</span>
            </h4>
            <div className="relative">
              <input
                type="text"
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                placeholder="اكتب اسم المدينة (فاس، مراكش، طنجة، أكادير، العيون، وجدة...)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              {citySearchQuery && (
                <button
                  onClick={() => setCitySearchQuery('')}
                  className="absolute left-3 top-2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {citySearchQuery.trim() && (
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pt-1">
                {allFilteredCities.length > 0 ? (
                  allFilteredCities.map((c) => (
                    <div
                      key={c.name}
                      onClick={() => handleSelectRegion(c.regionId)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-emerald-500 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-white">{c.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {c.regionName}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 tabular-nums">
                        {c.turnout}%
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 block text-center py-2">
                    ما لقيناش هاد المدينة، جرب تبدل الكلمة
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Turnout Progression Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white font-['Alexandria'] flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-sky-400" />
              <span>تطور نسبة المشاركة الوطنية عبر المحطات الانتخابية التشريعية</span>
            </h3>
            <p className="text-xs text-slate-400">
              مسار إقبال المواطنين على صناديق الاقتراع خلال الاستحقاقات البرلمانية
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>نسبة 2026:</span>
            <span className="font-bold text-sky-400">38.02%</span>
          </div>
        </div>

        {/* Visual Timeline Bar Chart */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {TURNOUT_TIMELINE.map((item) => {
            const isLatest = item.year === 2026;
            return (
              <div
                key={item.year}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  isLatest
                    ? 'bg-sky-950/40 border-sky-500/70 text-sky-300 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white font-mono text-base">{item.year}</span>
                    {isLatest && (
                      <span className="text-[10px] font-bold bg-sky-900/80 text-sky-200 px-1.5 py-0.5 rounded">
                        الرسمية
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-black font-mono tabular-nums text-white block">
                    {item.turnout}%
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1 leading-snug">
                    {item.label}
                  </span>
                </div>

                {/* Vertical Bar Indicator */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isLatest ? 'bg-sky-400' : 'bg-emerald-500'}`}
                    style={{ width: `${item.turnout}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
