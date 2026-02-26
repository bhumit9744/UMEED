import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, ChevronRight, Users, MapPin, Plus, 
  Home as HomeIcon, FileText, UserCircle, User, X, Calendar, 
  Activity, Baby, Stethoscope, MoreVertical, Check
} from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

// --- MOCK DATA ---
const INITIAL_FAMILIES = [
  {
    id: '1',
    headName: 'Rajesh Kumar',
    village: 'Mavli',
    mobile: '9876543210',
    membersCount: 4,
    hasPregnantWoman: true,
    riskLevel: 'High',
    healthStatus: 'Active',
    registeredDate: '2026-02-20',
    followUpDue: true,
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: '2',
    headName: 'Sita Devi',
    village: 'Gogunda',
    mobile: '8765432109',
    membersCount: 2,
    hasPregnantWoman: false,
    riskLevel: 'Low',
    healthStatus: 'Cured',
    registeredDate: '2026-02-15',
    followUpDue: false,
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: '3',
    headName: 'Anil Sharma',
    village: 'Mavli',
    mobile: '7654321098',
    membersCount: 6,
    hasPregnantWoman: false,
    riskLevel: 'Moderate',
    healthStatus: 'Under Follow-up',
    registeredDate: '2026-02-23',
    followUpDue: true,
    avatar: 'https://i.pravatar.cc/150?u=3'
  },
  {
    id: '4',
    headName: 'Priya Patel',
    village: 'Girwa',
    mobile: '6543210987',
    membersCount: 3,
    hasPregnantWoman: true,
    riskLevel: 'High',
    healthStatus: 'Active',
    registeredDate: '2026-02-24',
    followUpDue: false,
    avatar: 'https://i.pravatar.cc/150?u=4'
  },
  {
    id: '5',
    headName: 'Vikram Singh',
    village: 'Jhadol',
    mobile: '5432109876',
    membersCount: 5,
    hasPregnantWoman: false,
    riskLevel: 'Low',
    healthStatus: 'Active',
    registeredDate: '2026-01-10',
    followUpDue: false,
    avatar: ''
  }
];

const VILLAGES = ['All', 'Mavli', 'Gogunda', 'Girwa', 'Jhadol'];

export default function FamilyFolder() {
  const navigate = useNavigate();
const location = useLocation();
  const [families, setFamilies] = useState(INITIAL_FAMILIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // All | High Risk | Follow-ups Due
  
  // Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'All',
    riskLevel: 'All',
    pregnancyStatus: 'All',
    healthStatus: 'All',
    village: 'All'
  });
  const [tempFilters, setTempFilters] = useState(filters);

  // Long Press State
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const pressTimer = useRef(null);

  // --- LOGIC ---
  const handleTouchStart = (id) => {
    pressTimer.current = setTimeout(() => {
      setActiveActionMenu(id);
      if (window.navigator.vibrate) window.navigator.vibrate(50); // Haptic feedback
    }, 500);
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: 'All',
      riskLevel: 'All',
      pregnancyStatus: 'All',
      healthStatus: 'All',
      village: 'All'
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    setIsFilterModalOpen(false);
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters, [key]: 'All' };
    setFilters(newFilters);
    setTempFilters(newFilters);
  };

  // --- FILTERING & DERIVED STATE ---
  const filteredFamilies = useMemo(() => {
    return families.filter(family => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        family.headName.toLowerCase().includes(query) ||
        family.village.toLowerCase().includes(query) ||
        family.mobile.includes(query);
      if (!matchesSearch) return false;

      // 2. Tab Segment
      if (activeTab === 'High Risk' && family.riskLevel !== 'High') return false;
      if (activeTab === 'Follow-ups Due' && !family.followUpDue) return false;

      // 3. Modal Filters
      if (filters.riskLevel !== 'All' && family.riskLevel !== filters.riskLevel) return false;
      if (filters.village !== 'All' && family.village !== filters.village) return false;
      if (filters.healthStatus !== 'All' && family.healthStatus !== filters.healthStatus) return false;
      
      if (filters.pregnancyStatus === 'Has Pregnant Woman' && !family.hasPregnantWoman) return false;
      if (filters.pregnancyStatus === 'No Pregnant Woman' && family.hasPregnantWoman) return false;

      // Date logic (simplified for mockup)
      if (filters.dateRange !== 'All') {
        const today = new Date('2026-02-24').toISOString().split('T')[0];
        if (filters.dateRange === 'Today' && family.registeredDate !== today) return false;
        // Logic for 'This Week' / 'This Month' would go here in a real app
      }

      return true;
    });
  }, [families, searchQuery, activeTab, filters]);

  const activeFilterCount = Object.values(filters).filter(v => v !== 'All').length;

  return (
    <div className="max-w-md mx-auto relative bg-[#F9FAFB] min-h-screen pb-24 font-sans text-gray-900 shadow-2xl overflow-hidden sm:border-x border-gray-200">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Families</h1>
            <p className="text-sm text-gray-500 font-medium">{families.length} Registered households</p>
          </div>
          <button 
            onClick={() => { setTempFilters(filters); setIsFilterModalOpen(true); }}
            className="p-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 relative"
          >
            <Filter size={20} className="text-gray-700" />
            {activeFilterCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#3087DF] rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-0 focus:border-[#3087DF]/50 placeholder-gray-400 text-sm"
            placeholder="Search head name, village, mobile"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderBottom: '2px solid rgba(48, 135, 223, 0.15)' }}
          />
        </div>

        {/* Strategic Segmented Toggle */}
        <div className="flex bg-gray-200/70 p-1 rounded-full mb-2">
          {['All', 'High Risk', 'Follow-ups Due'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-xs font-semibold py-2 px-2 rounded-full transition-all duration-200 ease-out ${
                activeTab === tab 
                  ? 'bg-white text-[#3087DF] shadow-sm scale-100' 
                  : 'text-gray-500 hover:text-gray-700 scale-95'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {Object.entries(filters).map(([key, value]) => {
              if (value === 'All') return null;
              return (
                <div key={key} className="flex items-center gap-1 bg-[#3087DF]/10 text-[#3087DF] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap snap-start border border-[#3087DF]/20">
                  {value}
                  <button onClick={() => removeFilter(key)} className="ml-1 hover:bg-[#3087DF]/20 rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- MAIN CONTENT (FAMILY LIST) --- */}
      <div className="px-4 space-y-4 mt-2" onClick={() => setActiveActionMenu(null)}>
        {filteredFamilies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Users size={40} className="text-[#3087DF]/50" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No families found</h3>
            <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or search query.</p>
            {families.length === 0 ? (
              <button className="bg-[#3087DF] text-white px-6 py-3 rounded-full font-semibold shadow-md shadow-[#3087DF]/30 flex items-center gap-2">
                <Plus size={18} /> Add First Family
              </button>
            ) : (
              <button onClick={resetFilters} className="text-[#3087DF] font-semibold text-sm">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredFamilies.map((family) => (
            <div 
              key={family.id}
              className="relative select-none"
              onPointerDown={() => handleTouchStart(family.id)}
              onPointerUp={handleTouchEnd}
              onPointerLeave={handleTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className={`bg-white rounded-[16px] p-4 shadow-sm border ${family.followUpDue ? 'border-orange-200' : 'border-gray-100'} transition-all active:scale-[0.98]`}>
                
                {family.followUpDue && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-sm z-10" />
                )}

                <div className="flex gap-4">
                  {/* Left: Avatar */}
                  <div className="flex-shrink-0 relative">
                    {family.avatar ? (
                      <img src={family.avatar} alt={family.headName} className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                        <UserCircle size={32} />
                      </div>
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-bold text-gray-900 truncate pr-2">{family.headName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        family.riskLevel === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                        family.riskLevel === 'Moderate' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {family.riskLevel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="truncate">{family.village}</span>
                      <span className="text-gray-300 mx-1">•</span>
                      <Users size={14} className="text-gray-400" />
                      <span>{family.membersCount}</span>
                    </div>

                    <div className="flex justify-between items-end mt-3">
                      {family.hasPregnantWoman ? (
                        <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-100 w-max">
                          <Baby size={14} />
                          <span className="text-xs font-semibold">Pregnancy Active</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          No Active Pregnancy
                        </div>
                      )}

                      <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#3087DF]/10 hover:text-[#3087DF] transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Long Press Quick Actions Overlay */}
              {activeActionMenu === family.id && (
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm rounded-[16px] flex items-center justify-center gap-3 p-4 animate-fade-in">
                  <button className="flex flex-col items-center gap-2 text-white hover:scale-105 transition-transform" onClick={(e) => { e.stopPropagation(); setActiveActionMenu(null); }}>
                    <div className="w-12 h-12 rounded-full bg-[#3087DF] flex items-center justify-center shadow-lg"><Plus size={24} /></div>
                    <span className="text-xs font-semibold">Add Member</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 text-white hover:scale-105 transition-transform" onClick={(e) => { e.stopPropagation(); setActiveActionMenu(null); }}>
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg"><Activity size={24} /></div>
                    <span className="text-xs font-semibold">Follow-up</span>
                  </button>
                  <button className="absolute top-3 right-3 text-white/70 hover:text-white" onClick={(e) => { e.stopPropagation(); setActiveActionMenu(null); }}>
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- BOTTOM SHEET FILTER MODAL --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-md mx-auto">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterModalOpen(false)}
          />
          
          {/* Sheet Content */}
          <div className="bg-white rounded-t-[24px] relative z-10 max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto pb-32 space-y-6">
              
              {/* Filter Section: Date */}
              <FilterSection 
                title="Date Registered" 
                icon={<Calendar size={16} />}
                options={['All', 'Today', 'This Week', 'This Month', 'Custom']}
                value={tempFilters.dateRange}
                onChange={(val) => setTempFilters({...tempFilters, dateRange: val})}
              />

              {/* Filter Section: Risk Level */}
              <FilterSection 
                title="Risk Level" 
                icon={<Activity size={16} />}
                options={['All', 'High', 'Moderate', 'Low']}
                value={tempFilters.riskLevel}
                onChange={(val) => setTempFilters({...tempFilters, riskLevel: val})}
                colors={{'High': 'text-red-600 bg-red-50 border-red-200', 'Moderate': 'text-orange-600 bg-orange-50 border-orange-200', 'Low': 'text-green-600 bg-green-50 border-green-200'}}
              />

              {/* Filter Section: Pregnancy Status */}
              <FilterSection 
                title="Pregnancy Status" 
                icon={<Baby size={16} />}
                options={['All', 'Has Pregnant Woman', 'No Pregnant Woman']}
                value={tempFilters.pregnancyStatus}
                onChange={(val) => setTempFilters({...tempFilters, pregnancyStatus: val})}
              />

              {/* Filter Section: Village Dropdown */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <MapPin size={16} className="text-gray-400" /> Village
                </label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-[12px] focus:ring-[#3087DF] focus:border-[#3087DF] block p-3.5 appearance-none"
                  value={tempFilters.village}
                  onChange={(e) => setTempFilters({...tempFilters, village: e.target.value})}
                >
                  {VILLAGES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 pb-8 sm:pb-4">
              <button 
                onClick={resetFilters}
                className="flex-1 py-3.5 px-4 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={applyFilters}
                className="flex-[2] py-3.5 px-4 rounded-full font-bold text-white bg-[#3087DF] shadow-lg shadow-[#3087DF]/30 hover:bg-blue-600 transition-colors flex justify-center items-center gap-2"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BOTTOM NAVIGATION BAR --- */}
      {/* --- BOTTOM NAVIGATION BAR --- */}
<div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 pb-safe z-40 px-2 py-1.5 flex justify-around items-center shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">

 <NavIcon 
  icon={<HomeIcon size={24} strokeWidth={2} />} 
  label="Home" 
  active={location.pathname === "/dashboard"} 
  onClick={() => navigate("/dashboard")} 
/>

  <NavIcon 
    icon={<Users size={24} strokeWidth={2} />} 
    label="Families" 
    active={location.pathname === "/families"} 
    onClick={() => navigate("/families")} 
  />

  {/* FAB */}
  <div className="relative -top-6">
    <button 
      onClick={() => navigate("/add-family")}
      className="w-[60px] h-[60px] bg-[#3087DF] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_-6px_rgba(48,135,223,0.7)] hover:bg-blue-600 hover:scale-105 transition-transform border-[5px] border-white"
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>
  </div>

  <NavIcon 
    icon={<FileText size={24} strokeWidth={2} />} 
    label="Reports" 
    active={location.pathname === "/reports"} 
    onClick={() => navigate("/reports")} 
  />

  <NavIcon 
    icon={<User size={24} strokeWidth={2} />} 
    label="Profile" 
    active={location.pathname === "/profile"} 
    onClick={() => navigate("/profile")} 
  />

</div>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function FilterSection({ title, icon, options, value, onChange, colors = {} }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
        {icon && <span className="text-gray-400">{icon}</span>}
        {title}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = value === opt;
          const colorClass = colors[opt] || 'text-[#3087DF] bg-[#3087DF]/10 border-[#3087DF]';
          
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isSelected 
                  ? `${colorClass} shadow-sm ring-1 ring-current` 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  );
}

function NavIcon({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 gap-1 mt-1 transition-colors ${
        active 
          ? 'text-[#3087DF]' 
          : 'text-[#94A3B8] hover:text-[#3087DF]/70'
      }`}
    >
      {icon}
      <span className={`text-[11px] font-bold ${
        active ? 'text-[#3087DF]' : 'text-[#94A3B8]'
      }`}>
        {label}
      </span>
    </button>
  );
}

// --- CSS INJECTIONS ---
const style = document.createElement('style');
style.textContent = `
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 16px); }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  .animate-fade-in { animation: fade-in 0.2s ease-out; }
`;
document.head.appendChild(style);