import { supabase } from '../supabaseClient';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Filter, ChevronRight, Users, MapPin, Plus, 
  Home as HomeIcon, FileText, UserCircle, User, X, Calendar, 
  Activity, Baby, MoreVertical, ArrowLeft, Pencil, AlertCircle, 
  HeartPulse, Droplet, Scale, FileEdit, Download, Printer, 
  AlertTriangle, CheckCircle2, Info, Stethoscope, ClipboardList, Sparkles
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function FamilyFolder() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // All | High Risk | Follow-ups Due
  
  // Fetch data on load
  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      // Fetch families and join their related members
      const { data, error } = await supabase
        .from('families')
        .select('*, members(*)');

      if (error) throw error;

      // Map Supabase snake_case columns to your UI's expected format
      const formattedData = data.map(f => {
        const mappedMembers = f.members?.map(m => {
          // Parse JSON conditions/history if it exists, otherwise empty array
          let conditionsArr = [];
          if (m.history) {
            Object.keys(m.history).forEach(k => {
               if(m.history[k] === 'Yes' || m.history[k] === true) conditionsArr.push(k);
            });
          }

          return {
            id: m.id,
            name: m.name,
            age: m.age,
            gender: m.gender || 'F',
            relation: m.relation || 'Member',
            height: m.height || '',
            weight: m.weight || '',
            bmi: m.bmi || '',
            bp: m.sys_bp ? `${m.sys_bp}/80` : '--', // Maps your old sys_bp to the new BP string format
            sugar: m.sugar || '',
            hemoglobin: m.hemoglobin || '',
            pregnant: m.type === 'Pregnancy',
            highRisk: m.risk_level === 'Red' || m.risk_level === 'Orange',
            cured: false,
            conditions: conditionsArr,
            avatar: `https://ui-avatars.com/api/?name=${m.name}&background=random`
          };
        }) || [];

        return {
          id: f.id,
          headName: f.head_name || 'Unknown',
          village: f.village || '',
          mobile: f.mobile || '',
          houseNumber: f.house_number || '',
          membersCount: mappedMembers.length,
          hasPregnantWoman: mappedMembers.some(m => m.pregnant),
          riskLevel: mappedMembers.some(m => m.highRisk) ? 'High' : 'Low',
          registeredDate: f.created_at ? f.created_at.split('T')[0] : '',
          avatar: `https://ui-avatars.com/api/?name=${f.head_name}&background=random`,
          members: mappedMembers
        };
      });

      setFamilies(formattedData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  

  // Routing State
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);

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

  // --- ROUTING RENDER ---
  if (selectedFamilyId) {
    const family = families.find(f => f.id === selectedFamilyId);
    return <FamilyDetails family={family} onBack={() => setSelectedFamilyId(null)} setFamilies={setFamilies} />;
  }

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
              className="relative select-none cursor-pointer"
              onClick={() => {
                // Prevent navigation if clicking long-press action menu
                if (!activeActionMenu) setSelectedFamilyId(family.id);
              }}
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
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 pb-safe z-40 px-2 py-1.5 flex justify-around items-center shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <NavIcon icon={<HomeIcon size={24} strokeWidth={2} />} label="Home" />
        <NavIcon icon={<Users size={24} strokeWidth={2} />} label="Families" active />
        
        {/* FAB Style Add Button */}
        <div className="relative -top-6">
          <button className="w-[60px] h-[60px] bg-[#3087DF] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_-6px_rgba(48,135,223,0.7)] hover:bg-blue-600 hover:scale-105 transition-transform border-[5px] border-white">
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>
        
        <NavIcon icon={<FileText size={24} strokeWidth={2} />} label="Reports" />
        <NavIcon icon={<User size={24} strokeWidth={2} />} label="Profile" />
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

function NavIcon({ icon, label, active }) {
  return (
    <button className={`flex flex-col items-center justify-center w-16 gap-1 mt-1 transition-colors ${active ? 'text-[#3087DF]' : 'text-[#94A3B8] hover:text-[#3087DF]/70'}`}>
      {icon}
      <span className={`text-[11px] font-bold ${active ? 'text-[#3087DF]' : 'text-[#94A3B8]'}`}>{label}</span>
    </button>
  );
}

function FamilyDetails({ family, onBack, setFamilies }) {
  const [editingMember, setEditingMember] = useState(null); // null = not editing, {} = adding/editing
  const [selectedMemberReport, setSelectedMemberReport] = useState(null);
  const [isEditingFamily, setIsEditingFamily] = useState(false);

  // Sort members: High Risk first
  const sortedMembers = useMemo(() => {
    if (!family || !family.members) return [];
    return [...family.members].sort((a, b) => {
      if (a.highRisk && !b.highRisk) return -1;
      if (!a.highRisk && b.highRisk) return 1;
      return 0;
    });
  }, [family]);
  
  if (!family) return null;

  const handleSaveMember = (updatedMember) => {
    setFamilies(prevFamilies => prevFamilies.map(f => {
      if (f.id !== family.id) return f;
      
      const isExisting = f.members?.find(m => m.id === updatedMember.id);
      let newMembers;
      
      if (isExisting) {
        newMembers = f.members.map(m => m.id === updatedMember.id ? updatedMember : m);
      } else {
        newMembers = [...(f.members || []), { ...updatedMember, id: `m${Date.now()}` }];
      }

      // Re-calculate family risk based on members
      const hasHighRisk = newMembers.some(m => m.highRisk);
      const hasPregnant = newMembers.some(m => m.pregnant);

      return { 
        ...f, 
        members: newMembers,
        membersCount: newMembers.length,
        riskLevel: hasHighRisk ? 'High' : f.riskLevel === 'High' && !hasHighRisk ? 'Moderate' : f.riskLevel,
        hasPregnantWoman: hasPregnant
      };
    }));
    setEditingMember(null);
  };

  const handleSaveFamily = (updatedData) => {
    setFamilies(prevFamilies => prevFamilies.map(f => 
      f.id === family.id ? { ...f, ...updatedData } : f
    ));
    setIsEditingFamily(false);
  };

  // --- ROUTE TO FAMILY FORM PAGE ---
  if (isEditingFamily) {
    return (
      <FamilyForm 
        family={family} 
        onBack={() => setIsEditingFamily(false)} 
        onSave={handleSaveFamily} 
      />
    );
  }

  // --- ROUTE TO MEMBER FORM PAGE ---
  if (editingMember) {
    return (
      <MemberForm 
        member={editingMember} 
        onBack={() => setEditingMember(null)} 
        onSave={handleSaveMember} 
      />
    );
  }

  // --- ROUTE TO MEMBER REPORT PAGE ---
  if (selectedMemberReport) {
    return (
      <MemberReport
        family={family}
        member={selectedMemberReport}
        onBack={() => setSelectedMemberReport(null)}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto relative bg-[#F9FAFB] min-h-screen font-sans text-gray-900 shadow-2xl overflow-hidden sm:border-x border-gray-200 pb-24 animate-fade-in">
      
      {/* 1️⃣ HEADER */}
      <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md px-4 py-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 truncate max-w-[200px]">Family Details</h1>
            <p className="text-sm text-gray-500 font-medium">{family.village} • {family.houseNumber}</p>
          </div>
        </div>
        <button onClick={() => setIsEditingFamily(true)} className="p-2 -mr-2 rounded-full hover:bg-[#3087DF]/10 text-[#3087DF] transition-colors">
          <FileEdit size={22} />
        </button>
      </div>

      {/* 2️⃣ FAMILY SUMMARY CARD */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-[16px] p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Head of Family</p>
              <h2 className="text-[17px] font-bold text-gray-900">{family.headName}</h2>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              family.riskLevel === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
              family.riskLevel === 'Moderate' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
              'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {family.riskLevel} Risk
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-4">
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase mb-0.5">Mobile</p>
              <p className="font-medium text-gray-900">{family.mobile}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase mb-0.5">Total Members</p>
              <p className="font-medium text-gray-900 flex items-center gap-1.5"><Users size={14} className="text-[#3087DF]" /> {family.membersCount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase mb-0.5">Husband Edu.</p>
              <p className="font-medium text-gray-900">{family.husbandEducation || '--'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase mb-0.5">Wife Edu.</p>
              <p className="font-medium text-gray-900">{family.wifeEducation || '--'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3️⃣ SECTION TITLE */}
      <div className="px-4 mt-6 mb-3">
        <h2 className="text-lg font-bold text-gray-900">Members</h2>
        <p className="text-sm text-gray-500 font-medium">Scroll to view all family members</p>
      </div>

      {/* 4️⃣ MEMBER LIST CARDS */}
      <div className="px-4 space-y-4 pb-8">
        {sortedMembers.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-[16px] border border-gray-100 shadow-sm mt-2">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
              <Users size={28} className="text-[#3087DF]/50" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">No members added yet</h3>
            <p className="text-xs text-gray-500 mb-5">Keep family records complete by adding members.</p>
            <button 
              onClick={() => setEditingMember({ gender: 'M', conditions: [] })}
              className="bg-[#3087DF] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-[#3087DF]/30 flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>
        ) : (
          sortedMembers.map((member) => (
            <div key={member.id} className="flex flex-col gap-2">
              <div className={`bg-white rounded-[16px] p-4 shadow-sm border ${member.highRisk ? 'border-red-200 shadow-red-50' : 'border-gray-100'} transition-transform flex gap-3.5`}>
                
                {/* LEFT SIDE: Avatar */}
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-white ${
                    member.gender === 'M' ? 'bg-blue-400 border-blue-100' : 
                    member.gender === 'F' ? 'bg-pink-400 border-pink-100' : 'bg-gray-400 border-gray-100'
                  }`}>
                    <User size={24} />
                  </div>
                </div>

                {/* RIGHT SIDE: Content */}
                <div className="flex-1 min-w-0">
                  {/* Top Row: Name & Action Icons */}
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[15px] font-bold text-gray-900 truncate pr-2 leading-tight">{member.name}</h3>
                    <div className="flex items-center gap-1 -mt-1 -mr-1">
                      <button 
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 text-gray-400 hover:text-[#3087DF] hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Second Row: Demographic Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold tracking-wide">{member.gender}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold tracking-wide">Age: {member.age}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold tracking-wide">{member.relation}</span>
                  </div>

                  {/* Third Row: Health Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {member.highRisk && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-200">
                        <AlertCircle size={10} strokeWidth={3} /> High Risk
                      </span>
                    )}
                    {member.pregnant && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">Pregnant</span>
                    )}
                    {member.age < 5 && !member.pregnant && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">Child</span>
                    )}
                    {member.cured && (
                      <span className="px-2 py-0.5 rounded-full bg-white text-green-600 text-[10px] font-bold border border-green-500">Cured</span>
                    )}
                    {member.conditions?.map(cond => (
                      <span key={cond} className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100">{cond}</span>
                    ))}
                  </div>

                  {/* Fourth Row: Vitals Snapshot */}
                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500 font-semibold bg-gray-50/50 -mx-1 px-2 rounded-lg">
                    <span className="flex items-center gap-1"><HeartPulse size={12} className="text-gray-400" /> BP: <span className="text-gray-700">{member.bp || '--'}</span></span>
                    <span className="flex items-center gap-1"><Droplet size={12} className="text-gray-400" /> Sug: <span className="text-gray-700">{member.sugar || '--'}</span></span>
                    <span className="flex items-center gap-1"><Scale size={12} className="text-gray-400" /> BMI: <span className="text-gray-700">{member.bmi || '--'}</span></span>
                  </div>
                </div>
              </div>

              {/* View Report Button - Outside Card */}
              <button 
                onClick={() => setSelectedMemberReport(member)}
                className="w-full py-2.5 bg-white border border-[#3087DF]/20 shadow-sm rounded-[12px] text-[#3087DF] text-[13px] font-bold hover:bg-[#3087DF]/5 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText size={16} /> View Report
              </button>

            </div>
          ))
        )}
      </div>

      {/* 7️⃣ FLOATING ACTION BUTTON */}
      <div className="fixed bottom-8 right-6 z-40">
        <button 
          onClick={() => setEditingMember({ gender: 'M', conditions: [] })}
          className="h-14 px-5 bg-[#3087DF] rounded-full flex items-center justify-center gap-2 text-white shadow-[0_8px_20px_-6px_rgba(48,135,223,0.7)] hover:bg-blue-600 hover:scale-105 transition-transform"
        >
          <Plus size={24} strokeWidth={2.5} />
          <span className="font-bold text-sm">Add Member</span>
        </button>
      </div>

    </div>
  );
}

// --- MEMBER REPORT PAGE COMPONENT ---
// --- MEMBER REPORT PAGE COMPONENT ---
function MemberReport({ family, member, onBack }) {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [aiSummary, setAiSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Compute BMI dynamically (Properly closed now)
  const bmi = useMemo(() => {
    if (!member.height || !member.weight) return "--";
    const h = parseFloat(member.height) / 100;
    const w = parseFloat(member.weight);
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return "--";
  }, [member.height, member.weight]);

  // AI Summary Function (Moved OUTSIDE the useMemo)
  const generateAiSummary = async () => {
    setIsGenerating(true);
    setShowAiModal(true);
    
    try {
      // Create a prompt using the current patient's real data
      const prompt = `
        You are a helpful medical assistant for ASHA (rural health) workers in India. 
        Explain this patient's health report in very simple, easy-to-understand language. 
        Keep the summary under 4 sentences. Be encouraging and clear. No complex jargon.
        
        Patient Info: ${member.name}, ${member.age} yrs, ${member.gender}
        Vitals: BP ${member.bp || 'N/A'}, Sugar ${member.sugar || 'N/A'}, BMI ${bmi}, Hb ${member.hemoglobin || 'N/A'}
        Conditions: ${member.conditions?.join(', ') || 'None'}
        Pregnant: ${member.pregnant ? 'Yes' : 'No'}
        Risk Level: ${riskAnalysis.level}
        Care Plan: ${carePlan.join(', ')}
      `;

      // Replace this string with your actual Gemini API Key
      const API_KEY = "AIzaSyDFY50xZ6QhV7z12LoqeVogqneNh2G9n68"; 
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);
      
      const summaryText = data.candidates[0].content.parts[0].text;
      setAiSummary(summaryText);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiSummary("Sorry, I couldn't generate the summary right now. Please check your network or API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Analyze Risk Status
  const riskAnalysis = useMemo(() => {
    const reasons = [];
    let level = 'Healthy';

    // Parse Vitals safely
    const bpParts = member?.bp?.split('/');
    const sys = bpParts?.[0] ? parseInt(bpParts[0]) : 0;
    const dia = bpParts?.[1] ? parseInt(bpParts[1]) : 0;
    
    // Add logic rules
    if (sys >= 140 || dia >= 90) reasons.push(`Elevated BP (${member.bp})`);
    if (member?.sugar && parseFloat(member.sugar) > 200) reasons.push(`High Blood Sugar (${member.sugar})`);
    if (member?.hemoglobin && parseFloat(member.hemoglobin) < 11) reasons.push(`Low Hemoglobin (${member.hemoglobin})`);
    if (bmi !== "--") {
      if (parseFloat(bmi) > 25) reasons.push(`Abnormal BMI - Overweight (${bmi})`);
      if (parseFloat(bmi) < 18.5) reasons.push(`Abnormal BMI - Underweight (${bmi})`);
    }
    if (member?.pregnant && member?.highRisk) reasons.push("High Risk Pregnancy Flagged");
    
    // Conditions
    member?.conditions?.forEach(c => reasons.push(`Known ${c}`));

    // Determine level
    if (member?.highRisk || sys >= 160 || (member?.sugar && parseFloat(member.sugar) > 250)) {
      level = 'High Risk';
    } else if (reasons.length > 0) {
      level = 'At Risk';
    }

    return { reasons, level, sys, dia };
  }, [member, bmi]);

  // Generate Care Plan
  const carePlan = useMemo(() => {
    const plan = [];
    if (member?.pregnant) {
      plan.push("Ensure regular Iron & Calcium intake.");
      plan.push("Schedule and complete next ANC visit.");
      plan.push("Monitor BP and weight weekly.");
    }
    if (member?.conditions?.includes('Diabetes')) {
      plan.push("Strict dietary control (reduce sugar & carbs).");
      plan.push("Regular fasting & PP blood sugar checks.");
    }
    if (member?.conditions?.includes('Hypertension') || riskAnalysis.sys >= 140) {
      plan.push("Salt restricted diet.");
      plan.push("Daily BP monitoring at home/sub-center.");
    }
    if (member?.age <= 5) {
      plan.push("Ensure full immunization schedule is followed.");
      plan.push("Regular growth monitoring (weight/height).");
      plan.push("Provide nutritional supplements if required.");
    }
    if (plan.length === 0) {
      plan.push("Maintain a balanced, healthy diet.");
      plan.push("Regular physical activity (30 mins/day).");
      plan.push("Annual general health check-up.");
    }
    return plan;
  }, [member, riskAnalysis]);

  return (
    <div className="bg-[#E5E7EB] min-h-screen font-sans text-gray-900 pb-12 print:bg-white print:pb-0">
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
        }
      `}</style>

       
       {/* AI Summary Modal Overlay */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden animate-fade-in">
          <div className="bg-white rounded-[20px] p-6 max-w-sm w-full shadow-2xl relative animate-slide-up">
            <button 
              onClick={() => setShowAiModal(false)} 
              className="absolute top-4 right-4 p-1.5 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2 mb-4 border-b border-purple-100 pb-3">
              <Sparkles size={20} className="text-purple-600" /> AI Health Insight
            </h3>
            
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-purple-600 font-medium animate-pulse">Gemini is analyzing the report...</p>
              </div>
            ) : (
              <div className="text-gray-700 text-sm leading-relaxed font-medium">
                {aiSummary}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Action Bar (Screen Only) */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2">
         <button 
            onClick={generateAiSummary}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition-colors text-sm border border-purple-200 disabled:opacity-50" 
            title="AI Insights"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles size={16} />
            )}
            AI Summary
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#3087DF] text-white font-bold hover:bg-blue-600 transition-colors text-sm shadow-sm" title="Download/Print">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* A4 Document Container */}
      <div className="mt-4 sm:mt-8 w-full max-w-[210mm] min-h-[297mm] bg-white mx-auto shadow-2xl border border-gray-300 p-6 sm:p-12 print:mt-0 print:border-none print:shadow-none print:p-0 relative">
        
        {/* Document Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 uppercase tracking-wide">Health Assessment Report</h1>
            <p className="text-gray-500 font-mono text-xs mt-1">RECORD ID: {family.id}-{member.id}-{new Date().getFullYear()}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold text-gray-900 uppercase">{family.village}</p>
            <p className="text-gray-600">House No: <span className="font-semibold text-gray-900">{family.houseNumber}</span></p>
            <p className="text-gray-600">Date: <span className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</span></p>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><User size={14}/> Patient Demographics</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-0 text-sm border-t border-b border-gray-300 py-3 bg-gray-50/50">
            <div className="flex justify-between py-1.5 border-b border-gray-200/60"><span className="text-gray-600 font-medium">Patient Name:</span> <span className="font-bold text-gray-900">{member.name}</span></div>
            <div className="flex justify-between py-1.5 border-b border-gray-200/60"><span className="text-gray-600 font-medium">Age / Gender:</span> <span className="font-bold text-gray-900">{member.age} yrs / {member.gender}</span></div>
            <div className="flex justify-between py-1.5 border-b border-gray-200/60 sm:border-none"><span className="text-gray-600 font-medium">Head of Family:</span> <span className="font-bold text-gray-900">{family.headName}</span></div>
            <div className="flex justify-between py-1.5 sm:border-none"><span className="text-gray-600 font-medium">Relation to Head:</span> <span className="font-bold text-gray-900">{member.relation}</span></div>
          </div>
        </div>

        {/* Risk Assessment Box */}
        <div className={`mb-8 border border-gray-300 rounded-sm overflow-hidden`}>
          <div className={`px-4 py-2 border-b border-gray-300 flex items-center gap-2 ${
            riskAnalysis.level === 'High Risk' ? 'bg-red-100' : 
            riskAnalysis.level === 'At Risk' ? 'bg-orange-100' : 'bg-green-100'
          }`}>
            {riskAnalysis.level === 'High Risk' ? <AlertTriangle size={18} className="text-red-700"/> : 
             riskAnalysis.level === 'At Risk' ? <Info size={18} className="text-orange-700"/> : <CheckCircle2 size={18} className="text-green-700"/>}
            <h2 className={`text-sm font-bold uppercase tracking-widest ${
              riskAnalysis.level === 'High Risk' ? 'text-red-800' : 
              riskAnalysis.level === 'At Risk' ? 'text-orange-800' : 'text-green-800'
            }`}>Risk Classification: {riskAnalysis.level}</h2>
          </div>
          <div className={`p-4 ${
            riskAnalysis.level === 'High Risk' ? 'bg-red-50/50' : 
            riskAnalysis.level === 'At Risk' ? 'bg-orange-50/50' : 'bg-green-50/50'
          }`}>
            <h4 className="text-[11px] font-bold text-gray-600 uppercase mb-2">Identified Risk Factors</h4>
            {riskAnalysis.reasons.length > 0 ? (
              <ul className="text-sm font-medium text-gray-800 space-y-1 ml-4 list-disc marker:text-gray-400">
                {riskAnalysis.reasons.map(r => <li key={r}>{r}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 italic font-medium">No elevated risk factors detected based on current data.</p>
            )}
          </div>
        </div>

        {/* Clinical Vitals Table */}
        <div className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><HeartPulse size={14}/> Clinical Vitals</h2>
          <table className="w-full text-sm border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold w-1/4">Blood Pressure</td>
                <td className="border border-gray-300 p-2.5 font-bold text-center w-1/4">{member.bp || '--'}</td>
                <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold w-1/4">Blood Sugar</td>
                <td className="border border-gray-300 p-2.5 font-bold text-center w-1/4">{member.sugar || '--'}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold">Height</td>
                <td className="border border-gray-300 p-2.5 font-bold text-center">{member.height ? `${member.height} cm` : '--'}</td>
                <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold">Weight</td>
                <td className="border border-gray-300 p-2.5 font-bold text-center">{member.weight ? `${member.weight} kg` : '--'}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold">BMI</td>
                <td className="border border-gray-300 p-2.5 font-bold text-center">{bmi}</td>
                <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold">Hemoglobin</td>
                <td className="border border-gray-300 p-2.5 font-bold text-center">{member.hemoglobin || '--'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conditional: Maternal Health Details */}
        {member.pregnant && (
          <div className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><Baby size={14}/> Maternal Health Details</h2>
            <table className="w-full text-sm border-collapse border border-gray-300 mb-2">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold w-1/4">Gravida / Para</td>
                  <td className="border border-gray-300 p-2.5 font-bold text-center w-1/4">2 / 1 (Sample)</td>
                  <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold w-1/4">Trimester</td>
                  <td className="border border-gray-300 p-2.5 font-bold text-center w-1/4">3rd (Sample)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold">LMP</td>
                  <td className="border border-gray-300 p-2.5 font-bold text-center">15-Jun (Sample)</td>
                  <td className="border border-gray-300 p-2.5 bg-gray-100 text-gray-600 font-semibold">Danger Signs</td>
                  <td className={`border border-gray-300 p-2.5 font-bold text-center ${riskAnalysis.reasons.length ? 'text-red-600' : 'text-green-600'}`}>
                    {riskAnalysis.reasons.length ? 'Present' : 'None Detected'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Conditional: Chronic Disease Profile */}
        {member.conditions?.length > 0 && !member.pregnant && (
          <div className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><Activity size={14}/> Chronic Disease Profile</h2>
            <div className="border border-gray-300 p-4 bg-gray-50/50">
              <div className="flex gap-2 mb-3">
                <span className="font-semibold text-gray-600 text-sm">Diagnosed Conditions:</span>
                <div className="flex flex-wrap gap-1.5">
                   {member.conditions.map(c => <span key={c} className="font-bold text-gray-900 text-sm">{c},</span>)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-200">
                <div><span className="font-semibold text-gray-600">Last Follow-up Visit:</span> <span className="font-bold text-gray-900 ml-1">{member.lastVisit || 'Not recorded'}</span></div>
                <div><span className="font-semibold text-gray-600">Next Scheduled Visit:</span> <span className="font-bold text-gray-900 ml-1">{member.nextVisit || 'Not scheduled'}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Care Plan */}
        <div className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><ClipboardList size={14}/> Care Plan & Recommendations</h2>
          <div className="border border-gray-300 p-4 bg-gray-50/50">
            <ul className="list-none space-y-2.5 text-sm text-gray-800 font-medium">
              {carePlan.map((planItem, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="text-gray-400 mt-[1px]">☑</span>
                  {planItem}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Provider Signatures */}
        <div className="mt-20 grid grid-cols-2 gap-8 text-center pt-8">
          <div>
            <div className="border-t border-gray-400 w-48 mx-auto pt-2 text-gray-600 font-semibold text-xs uppercase tracking-wider">Health Worker Signature</div>
          </div>
          <div>
            <div className="border-t border-gray-400 w-48 mx-auto pt-2 text-gray-600 font-semibold text-xs uppercase tracking-wider">Medical Officer Signature</div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="absolute bottom-6 left-0 w-full text-center text-[10px] text-gray-400 font-mono uppercase tracking-widest px-12">
          Official Health Record • Generated by CHW Application Platform
        </div>
      </div>
    </div>
  );
}

// --- MEMBER FORM PAGE COMPONENT ---
function MemberForm({ member, onBack, onSave }) {
  const [formData, setFormData] = useState({
    id: member.id || '',
    name: member.name || '',
    age: member.age || '',
    gender: member.gender || 'M',
    relation: member.relation || '',
    mobile: member.mobile || '',
    education: member.education || '',
    occupation: member.occupation || '',
    height: member.height || '',
    weight: member.weight || '',
    bmi: member.bmi || '',
    bp: member.bp || '',
    sugar: member.sugar || '',
    hemoglobin: member.hemoglobin || '',
    pregnant: member.pregnant || false,
    highRisk: member.highRisk || false,
    cured: member.cured || false,
    conditions: member.conditions || [],
    lastVisit: member.lastVisit || '',
    nextVisit: member.nextVisit || '',
    notes: member.notes || ''
  });

  // Scroll to top when this "page" mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-calculate BMI
  useEffect(() => {
    if (formData.height && formData.weight) {
      const h = parseFloat(formData.height) / 100;
      const w = parseFloat(formData.weight);
      if (h > 0 && w > 0) {
        setFormData(prev => ({ ...prev, bmi: (w / (h * h)).toFixed(1) }));
      }
    }
  }, [formData.height, formData.weight]);

  const toggleCondition = (cond) => {
    setFormData(prev => {
      const exists = prev.conditions.includes(cond);
      return {
        ...prev,
        conditions: exists ? prev.conditions.filter(c => c !== cond) : [...prev.conditions, cond]
      };
    });
  };

  const isNew = !member.id;

  return (
    <div className="max-w-md mx-auto relative bg-[#F9FAFB] min-h-screen font-sans text-gray-900 shadow-2xl overflow-hidden sm:border-x border-gray-200 pb-24 animate-fade-in">
      
      {/* Page Header */}
      <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md px-4 py-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 truncate max-w-[200px]">{isNew ? 'Add Member' : 'Edit Member'}</h1>
            <p className="text-sm text-gray-500 font-medium">{isNew ? 'Fill in member details' : 'Update health records'}</p>
          </div>
        </div>
      </div>

      {/* Page Scrollable Body */}
      <div className="px-4 py-5 space-y-6">
        
        {/* SECTION 1: Personal Info */}
        <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User size={16} className="text-[#3087DF]" /> Personal Info
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] focus:border-[#3087DF] outline-none transition-all" placeholder="Enter name" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Age</label>
                <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none" placeholder="Yrs" />
              </div>
              <div className="flex-[1.5]">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none appearance-none">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Relation</label>
                <input type="text" value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none" placeholder="e.g. Wife" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Mobile</label>
                <input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none" placeholder="Optional" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Vitals */}
        <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <HeartPulse size={16} className="text-[#3087DF]" /> Vitals
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Height (cm)</label>
              <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[10px] px-2 py-2 text-center text-sm outline-none focus:ring-[#3087DF]" placeholder="--" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Weight (kg)</label>
              <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[10px] px-2 py-2 text-center text-sm outline-none focus:ring-[#3087DF]" placeholder="--" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">BMI</label>
              <div className="w-full bg-gray-100 border border-transparent rounded-[10px] px-2 py-2 text-center text-sm font-semibold text-gray-700">{formData.bmi || '--'}</div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">BP</label>
              <input type="text" value={formData.bp} onChange={e => setFormData({...formData, bp: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[10px] px-2 py-2 text-center text-sm outline-none focus:ring-[#3087DF]" placeholder="120/80" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Sugar</label>
              <input type="number" value={formData.sugar} onChange={e => setFormData({...formData, sugar: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[10px] px-2 py-2 text-center text-sm outline-none focus:ring-[#3087DF]" placeholder="--" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-center">Hb (g/dL)</label>
              <input type="number" step="0.1" value={formData.hemoglobin} onChange={e => setFormData({...formData, hemoglobin: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[10px] px-2 py-2 text-center text-sm outline-none focus:ring-[#3087DF]" placeholder="--" />
            </div>
          </div>
        </div>

        {/* SECTION 3: Medical Status */}
        <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-[#3087DF]" /> Medical Status
          </h3>
          
          {/* Toggles Row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => setFormData({...formData, highRisk: !formData.highRisk})}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${formData.highRisk ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-500 border-gray-200'}`}
            >
              High Risk
            </button>
            <button 
              onClick={() => setFormData({...formData, pregnant: !formData.pregnant})}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${formData.pregnant ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-white text-gray-500 border-gray-200'}`}
            >
              Pregnant
            </button>
            <button 
              onClick={() => setFormData({...formData, cured: !formData.cured})}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${formData.cured ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200'}`}
            >
              Cured
            </button>
          </div>

          {/* Checkboxes */}
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2 ml-1">Conditions</label>
          <div className="grid grid-cols-2 gap-2">
            {['Diabetes', 'Hypertension', 'Asthma', 'Thyroid', 'TB', 'Anemia'].map(cond => (
              <label key={cond} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.conditions.includes(cond)}
                  onChange={() => toggleCondition(cond)}
                  className="w-4 h-4 text-[#3087DF] rounded border-gray-300 focus:ring-[#3087DF]"
                />
                <span className="text-sm font-medium text-gray-700">{cond}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 4: Follow-up Info */}
        <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-[#3087DF]" /> Follow-up Info
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Last Visit</label>
                <input type="date" value={formData.lastVisit} onChange={e => setFormData({...formData, lastVisit: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3 py-2 text-sm focus:ring-[#3087DF] outline-none text-gray-700" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Next Visit</label>
                <input type="date" value={formData.nextVisit} onChange={e => setFormData({...formData, nextVisit: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3 py-2 text-sm focus:ring-[#3087DF] outline-none text-gray-700" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Notes</label>
              <textarea 
                rows="2" 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none resize-none" 
                placeholder="Add any remarks..."
              />
            </div>
          </div>
        </div>

      </div>

      {/* Page Bottom Fixed Actions */}
      <div className="fixed bottom-0 w-full max-w-md p-4 bg-white border-t border-gray-100 flex gap-3 pb-safe z-40 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <button 
          onClick={onBack}
          className="flex-1 py-3.5 px-4 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => onSave(formData)}
          className="flex-[2] py-3.5 px-4 rounded-full font-bold text-white bg-[#3087DF] shadow-lg shadow-[#3087DF]/30 hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// --- FAMILY FORM PAGE COMPONENT ---
function FamilyForm({ family, onBack, onSave }) {
  const [formData, setFormData] = useState({
    headName: family.headName || '',
    mobile: family.mobile || '',
    village: family.village || '',
    houseNumber: family.houseNumber || '',
    husbandEducation: family.husbandEducation || '',
    wifeEducation: family.wifeEducation || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-md mx-auto relative bg-[#F9FAFB] min-h-screen font-sans text-gray-900 shadow-2xl overflow-hidden sm:border-x border-gray-200 pb-24 animate-fade-in">
      
      {/* Page Header */}
      <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md px-4 py-4 border-b border-gray-200 flex items-center gap-3 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 truncate">Edit Family</h1>
          <p className="text-sm text-gray-500 font-medium">Update household information</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 py-5 space-y-6">
        
        {/* Core Info */}
        <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={16} className="text-[#3087DF]" /> Core Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Head of Family</label>
              <input type="text" value={formData.headName} onChange={e => setFormData({...formData, headName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] focus:border-[#3087DF] outline-none transition-all" placeholder="Enter name" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Mobile Number</label>
              <input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none" placeholder="10-digit number" />
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-[#3087DF]" /> Location
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Village</label>
                <select value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none appearance-none">
                  <option value="Mavli">Mavli</option>
                  <option value="Gogunda">Gogunda</option>
                  <option value="Girwa">Girwa</option>
                  <option value="Jhadol">Jhadol</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">House No.</label>
                <input type="text" value={formData.houseNumber} onChange={e => setFormData({...formData, houseNumber: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none" placeholder="e.g. M-142" />
              </div>
            </div>
          </div>
        </div>

        {/* Education Info */}
        <div className="bg-white p-4 rounded-[16px] shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-[#3087DF]" /> Parent Education
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Husband Education</label>
              <select value={formData.husbandEducation} onChange={e => setFormData({...formData, husbandEducation: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none appearance-none">
                <option value="">Select Level</option>
                <option value="None">None</option>
                <option value="5th Pass">5th Pass</option>
                <option value="8th Pass">8th Pass</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Wife Education</label>
              <select value={formData.wifeEducation} onChange={e => setFormData({...formData, wifeEducation: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-3.5 py-2.5 text-sm focus:ring-[#3087DF] outline-none appearance-none">
                <option value="">Select Level</option>
                <option value="None">None</option>
                <option value="5th Pass">5th Pass</option>
                <option value="8th Pass">8th Pass</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Fixed Actions */}
      <div className="fixed bottom-0 w-full max-w-md p-4 bg-white border-t border-gray-100 flex gap-3 pb-safe z-40 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <button 
          onClick={onBack}
          className="flex-1 py-3.5 px-4 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={() => onSave(formData)}
          className="flex-[2] py-3.5 px-4 rounded-full font-bold text-white bg-[#3087DF] shadow-lg shadow-[#3087DF]/30 hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
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