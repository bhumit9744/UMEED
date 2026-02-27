import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  ChevronRight, 
  Users, 
  UserPlus, 
  Baby, 
  HeartPulse, 
  ClipboardList, 
  Stethoscope,
  AlertCircle,
  RefreshCw,
  CloudOff,
  Map,
  Mic,
  CheckCircle2,
  Home,
  FileText,
  Briefcase,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  Settings,
  History,
  Package,
  Route,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
   
  
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, offline
  
  // Drawer & Modal States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  // --- MOCK DATA ---
  const ashaData = {
    name: "Sunita Devi",
    id: "ASHA-8492",
    village: "Phulwari Sharif",
    date: new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
    lastSynced: "Today, 08:30 AM"
  };

  const priorities = {
    highRiskPregnancy: 2,
    missedImmunization: 0,
    ncdFollowUps: 5
  };

  const [activeCases, setActiveCases] = useState([
    { id: 1, name: "Meena Kumari", category: "Pregnant", risk: "high", nextVisit: "Today", isOverdue: true },
    { id: 2, name: "Raju (2m)", category: "Child", risk: "low", nextVisit: "Tomorrow", isOverdue: false },
    { id: 3, name: "Ramesh Singh", category: "Adult", risk: "moderate", nextVisit: "26 Feb", isOverdue: false },
    { id: 4, name: "Sita Devi", category: "Pregnant", risk: "moderate", nextVisit: "28 Feb", isOverdue: false },
  ]);

  const performance = {
    totalFamilies: 142,
    activePregnancies: 18,
    childrenUnder3: 45,
    highRiskCases: 6
  };

  const incentives = {
    institutionalDeliveries: 3,
    fullImmunizations: 12,
    ncdScreenings: 45,
    tbNotifications: 1,
    totalEarned: 2450
  };

  // --- ACTIONS ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSyncStatus('syncing');
    setTimeout(() => {
      setIsRefreshing(false);
      setSyncStatus('synced');
    }, 1500);
  };

  const markVisitComplete = (id) => {
    // Remove the completed case from the list
    setActiveCases(prevCases => prevCases.filter(caseItem => caseItem.id !== id));
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    alert("Successfully logged out. Redirecting to login screen...");
  };

  const toggleExpand = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  // --- HELPERS ---
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'moderate': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-800 sm:max-w-md sm:mx-auto sm:border-x sm:border-slate-200 sm:shadow-xl relative overflow-hidden flex flex-col">
      
      {/* 1. TOP GREETING HEADER */}
      <header className="bg-white px-4 pt-5 pb-4 sticky top-0 z-20 border-b-[3px] border-[#3087DF]/15 rounded-b-2xl shadow-sm flex-shrink-0">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-1 text-slate-800 hover:bg-slate-100 rounded-full transition-colors -ml-1"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">Good Morning, {ashaData.name}</h1>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <span className="text-[#3087DF]">{ashaData.village}</span> 
                <span className="w-1 h-1 rounded-full bg-slate-300"></span> 
                {ashaData.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="p-1.5 text-slate-400 hover:text-[#3087DF] transition-colors relative">
              {syncStatus === 'syncing' ? <RefreshCw className="w-5 h-5 animate-spin text-[#3087DF]" /> : 
               syncStatus === 'offline' ? <CloudOff className="w-5 h-5 text-red-500" /> : 
               <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </button>
          </div>
        </div>
        {isRefreshing && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#3087DF] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" /> Syncing data...
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
        
        {/* 2. TODAY'S PRIORITIES */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Today's Priority Visits</h2>
          <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-l-4 border-[#3087DF] overflow-hidden">
            <PriorityCard 
              icon={<AlertCircle className="w-5 h-5 text-red-500" />}
              title="High Risk Pregnancy"
              count={priorities.highRiskPregnancy}
              isCritical
            />
            <div className="h-[1px] bg-slate-100 mx-4"></div>
            <PriorityCard 
              icon={<Baby className="w-5 h-5 text-orange-500" />}
              title="Missed Immunization"
              count={priorities.missedImmunization}
            />
            <div className="h-[1px] bg-slate-100 mx-4"></div>
            <PriorityCard 
  icon={<HeartPulse className="w-5 h-5 text-[#3087DF]" />}
  title="NCD Follow-ups"
  count={priorities.ncdFollowUps}
  onClick={() => navigate("/ncd-followup")}
/>
          </div>
        </section>

        {/* 4. ACTIVE CASE SUMMARY */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Active Cases requiring Attention</h2>
          {activeCases.length === 0 ? (
            <div className="bg-green-50 border border-green-100 rounded-[16px] p-6 flex flex-col items-center justify-center text-green-700 shadow-sm mx-1 transition-all">
              <CheckCircle2 className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-sm font-bold">All caught up!</p>
              <p className="text-xs font-medium opacity-80 mt-1">No pending cases require attention.</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {activeCases.map((caseItem) => (
                <div 
                  key={caseItem.id} 
                  className={`min-w-[220px] snap-start bg-white rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border flex flex-col justify-between
                    ${caseItem.isOverdue ? 'border-red-400' : 'border-slate-100'}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRiskColor(caseItem.risk)}`}>
                        {caseItem.risk} Risk
                      </span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{caseItem.category}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{caseItem.name}</h3>
                    <p className={`text-xs mt-1 font-medium ${caseItem.isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                      {caseItem.isOverdue ? 'Overdue: ' : 'Visit: '}{caseItem.nextVisit}
                    </p>
                  </div>
                  <button 
                    onClick={() => markVisitComplete(caseItem.id)}
                    className="mt-4 w-full bg-[#3087DF]/10 hover:bg-[#3087DF] text-[#3087DF] hover:text-white transition-colors py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Complete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. PERFORMANCE SUMMARY */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Your Territory</h2>
          <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 p-4">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <StatItem label="Total Families" value={performance.totalFamilies} />
              <StatItem label="Active Pregnancies" value={performance.activePregnancies} />
              <StatItem label="Children < 3 Yrs" value={performance.childrenUnder3} />
              <StatItem label="High Risk Cases" value={performance.highRiskCases} isAlert />
            </div>
          </div>
        </section>

        {/* 6. INCENTIVE TRACKER */}
        <section className="pb-6">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">This Month's Incentives</h2>
          <div className="bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-4 space-y-3">
              <IncentiveRow label="Institutional Deliveries" count={incentives.institutionalDeliveries} />
              <IncentiveRow label="Full Immunizations" count={incentives.fullImmunizations} />
              <IncentiveRow label="NCD Screenings" count={incentives.ncdScreenings} />
              <IncentiveRow label="TB Notifications" count={incentives.tbNotifications} />
            </div>
            <div className="bg-[#ebf4fc] px-4 py-3 flex justify-between items-center border-t border-[#3087DF]/10">
              <span className="text-sm font-bold text-slate-700">Estimated Total</span>
              <span className="text-xl font-black text-[#3087DF]">₹{incentives.totalEarned}</span>
            </div>
            <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-[#3087DF] hover:bg-slate-50 transition-colors uppercase tracking-wider">
              View Detailed Ledger
            </button>
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM NAVIGATION */}
      {/* STICKY BOTTOM NAVIGATION */}
<nav className="bg-white border-t border-slate-200 flex justify-around items-center px-2 py-3 pb-safe absolute bottom-0 w-full sm:max-w-md z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">

  {/* HOME */}
  <NavItem 
    icon={<Home />} 
    label="Home" 
    isActive={location.pathname === "/"} 
    onClick={() => navigate("/")} 
  />

  {/* FAMILIES */}
  <NavItem 
    icon={<Users />} 
    label="Families" 
    isActive={location.pathname === "/families"} 
    onClick={() => navigate("/families")} 
  />

  {/* CENTER FLOATING BUTTON */}
  <div className="-mt-6">
    <button 
      onClick={() => navigate("/add-family")}
      className="bg-[#3087DF] text-white p-3 rounded-full shadow-lg shadow-[#3087DF]/40 active:scale-95 transition-transform border-4 border-white"
    >
      <Plus className="w-6 h-6" />
    </button>
  </div>

  {/* REPORTS */}
  <NavItem 
    icon={<FileText />} 
    label="Reports" 
    isActive={location.pathname === "/reports"} 
    onClick={() => navigate("/reports")} 
  />

  {/* PROFILE */}
  <NavItem 
    icon={<User />} 
    label="Profile" 
    isActive={location.pathname === "/profile"} 
    onClick={() => navigate("/profile")} 
  />

</nav>

      {/* --- GLOBAL SLIDING DRAWER MENU --- */}
      {/* Backdrop Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Left Drawer Panel */}
      <div className={`fixed top-0 left-0 h-[100dvh] w-[85%] max-w-[320px] bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col rounded-r-2xl shadow-2xl ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Drawer Header Strip (#3087DF) */}
        <div className="bg-[#3087DF] p-5 text-white rounded-tr-2xl flex justify-between items-start shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 shadow-sm">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{ashaData.name}</h3>
              <p className="text-xs text-blue-100 mt-0.5">{ashaData.id}</p>
              <div className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-medium mt-1.5 inline-block">
                📍 {ashaData.village}
              </div>
            </div>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Menu Items */}
        <div className="flex-1 overflow-y-auto py-3 hide-scrollbar">
          <DrawerItem 
  icon={<Stethoscope />} 
  label="eSanjeevni" 
  onClick={() => {
    setIsDrawerOpen(false);
    navigate("/esanjeevni");
  }} 
/>

        </div>

        {/* Drawer Footer / Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 pb-safe">
          <button 
            onClick={() => setIsLogoutModalOpen(true)} 
            className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)} />
          <div className="bg-white rounded-2xl w-full max-w-[320px] p-6 relative z-10 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-500 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Ready to Logout?</h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              Are you sure you want to log out? Ensure all your latest visits are synced before leaving.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)} 
                className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="flex-1 py-3 bg-[#3087DF] text-white font-bold rounded-xl text-sm hover:bg-[#256eb8] shadow-md shadow-[#3087DF]/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- SUB-COMPONENTS ---

function PriorityCard({ icon, title, count, isCritical, onClick }) {
  if (count === 0) {
    return (
      <div 
      onClick={onClick}
      className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
        <div className="flex items-center gap-3 opacity-60">
          <div className="bg-green-100 p-2 rounded-xl text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-600 text-sm">{title}</span>
        </div>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">All clear</span>
      </div>
    );
  }

  return (
    <div 
    onClick={onClick}
    className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${isCritical ? 'bg-red-50' : 'bg-[#ebf4fc]'}`}>
          {icon}
        </div>
        <span className="font-semibold text-slate-800 text-sm">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isCritical ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700'}`}>
          {count}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#3087DF] transition-colors" />
      </div>
    </div>
  );
}

function StatItem({ label, value, isAlert }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-black ${isAlert ? 'text-red-500' : 'text-[#3087DF]'}`}>
        {value}
      </p>
    </div>
  );
}

function IncentiveRow({ label, count }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-600 font-medium">{label}</span>
      <span className="font-bold text-slate-800 bg-slate-100 px-2 rounded-md">{count}</span>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors ${isActive ? 'text-[#3087DF]' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {React.cloneElement(icon, { className: `w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}` })}
      <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
}

// Drawer Sub-components
function DrawerItem({ icon, label, sublabel, actionText, badge, hasChildren, isExpanded, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex justify-between items-center w-full p-3.5 mx-2 rounded-xl hover:bg-[#3087DF]/10 active:bg-[#3087DF]/20 transition-colors cursor-pointer group"
      style={{ width: 'calc(100% - 16px)' }}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="text-slate-400 group-hover:text-[#3087DF] transition-colors">
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <div className="flex flex-col items-start w-full">
          <span className="text-sm font-semibold text-slate-700 group-hover:text-[#3087DF]">{label}</span>
          {sublabel && <span className="text-[10px] font-medium text-slate-400 mt-0.5">{sublabel}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {actionText && (
          <span className="text-[10px] font-bold text-[#3087DF] bg-[#3087DF]/10 px-2 py-1 rounded">
            {actionText}
          </span>
        )}
        {badge && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {badge}
          </span>
        )}
        {hasChildren ? (
          isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#3087DF]" />
        )}
      </div>
    </div>
  );
}

function DrawerSubItem({ label }) {
  return (
    <div className="w-full text-left py-2.5 pl-12 pr-4 text-sm font-medium text-slate-500 hover:text-[#3087DF] hover:bg-slate-100 transition-colors cursor-pointer">
      {label}
    </div>
  );
}