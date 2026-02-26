import React, { useState } from 'react';
import { 
  Home, Users, PlusCircle, FileText, User, 
  Camera, Edit2, AlertCircle, Upload, MapPin, 
  Phone, Briefcase, GraduationCap, Building2, 
  CreditCard, Activity, Baby, FileWarning, 
  Fingerprint, Globe, Bell, RefreshCw, 
  WifiOff, HardDrive, Trash2, HelpCircle, 
  BookOpen, UserCheck, ChevronRight, LogOut,
  TrendingUp, Shield
} from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Reusable components for consistency
  const SectionTitle = ({ children }) => (
    <h3 className="text-sm font-semibold text-slate-800 mb-3 px-1 tracking-wide uppercase">{children}</h3>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-sm p-4 mb-4 border border-slate-100 ${className}`}>
      {children}
    </div>
  );

  const ListItem = ({ icon: Icon, label, value, onClick, hasArrow = true }) => (
    <div 
      className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 active:bg-slate-50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-slate-400" />}
        <span className="text-slate-700 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-slate-500 text-sm">{value}</span>}
        {hasArrow && <ChevronRight className="w-4 h-4 text-slate-300" />}
      </div>
    </div>
  );

  const ToggleItem = ({ icon: Icon, label, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-slate-400" />}
        <span className="text-slate-700 text-sm font-medium">{label}</span>
      </div>
      <div 
        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-[#3087DF]' : 'bg-slate-200'}`}
        onClick={() => onChange(!checked)}
      >
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20 max-w-md mx-auto relative font-sans">
      
      {/* 1️⃣ TOP PROFILE HEADER */}
      <div className="bg-white rounded-b-[2rem] shadow-sm mb-4 relative overflow-hidden">
        {/* Top Blue Strip */}
        <div className="h-24 bg-[#3087DF] w-full absolute top-0 left-0" />
        
        <div className="relative pt-12 pb-6 px-4 flex flex-col items-center">
          {/* Profile Photo */}
          <div className="relative mb-3">
            <div className="w-[100px] h-[100px] rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200" 
                alt="ASHA Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md text-[#3087DF] border border-slate-100 active:scale-95 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Identity Info */}
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sunita Devi</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">ASHA ID: ASH-2023-8941</p>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-sm text-slate-600">Palghar Village, PHC Boisar</p>
          </div>

          {/* Status Badge */}
          <div className="mt-3 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Active Duty
          </div>
        </div>
        
        {/* Thin Divider */}
        <div className="h-[1px] w-full bg-[#3087DF] opacity-15" />
      </div>

      <div className="px-4 space-y-4">

        {/* 🔹 BASIC DETAILS CARD */}
        <section>
          <SectionTitle>Basic Information</SectionTitle>
          <Card>
            <div className="grid grid-cols-2 gap-y-4 gap-x-3 mb-4">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Full Name</span>
                <span className="text-sm font-semibold text-slate-800">Sunita Devi</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Mobile Number</span>
                <span className="text-sm font-semibold text-slate-800">+91 98765 43210</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Years of Service</span>
                <span className="text-sm font-semibold text-slate-800">4 Years</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Qualification</span>
                <span className="text-sm font-semibold text-slate-800">12th Pass</span>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-full border border-[#3087DF] text-[#3087DF] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 active:bg-blue-100 transition-colors">
              <Edit2 className="w-4 h-4" /> Edit Profile Details
            </button>
          </Card>
        </section>

        {/* 🔹 PAYMENT & BANK DETAILS CARD */}
        <section>
          <SectionTitle>Payment & Incentives</SectionTitle>
          <Card>
            {/* Section 1: Bank Details */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">State Bank of India</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">A/C: •••• •••• 5678</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-[#3087DF] flex items-center gap-1 active:opacity-70">
                Update Bank Details <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Section 2: Incentives */}
            <div className="pt-4">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">This Month Incentive</span>
                  <span className="text-2xl font-black text-[#3087DF]">₹ 4,500</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block mb-1">Total Year</span>
                  <span className="text-sm font-bold text-slate-700">₹ 38,200</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Last credited on 5th Oct 2023
              </p>
              <button className="w-full py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:bg-slate-300 transition-colors">
                View Full Payment History
              </button>
            </div>
          </Card>
        </section>

        {/* 📍 Supervisor Details (Founder Level) */}
        <section>
          <SectionTitle>Chain of Command</SectionTitle>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2.5 rounded-full text-orange-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Priya Sharma</h4>
                  <p className="text-xs text-slate-500">ANM Supervisor • PHC Boisar</p>
                </div>
              </div>
              <button className="bg-green-50 p-2.5 rounded-full text-green-600 active:bg-green-100">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </section>

        {/* 🗂 Document Upload Section (Founder Level) */}
        <section>
          <SectionTitle>My Documents</SectionTitle>
          <Card className="!p-2">
            <ListItem icon={FileText} label="Aadhar / ID Proof" value="Verified" />
            <ListItem icon={GraduationCap} label="Training Certificates" value="2 Uploaded" />
            <div className="p-2">
              <button className="w-full py-2 rounded-xl bg-slate-50 border border-slate-200 border-dashed text-slate-600 font-medium text-sm flex items-center justify-center gap-2 active:bg-slate-100">
                <Upload className="w-4 h-4" /> Upload New Document
              </button>
            </div>
          </Card>
        </section>

        {/* 🔹 ACCOUNT OPTIONS SECTION */}
        <section>
          <SectionTitle>Account Options</SectionTitle>
          <Card className="!p-2">
            <ListItem icon={Shield} label="Change PIN" />
            <ToggleItem icon={Fingerprint} label="Enable Biometric Login" checked={biometricEnabled} onChange={setBiometricEnabled} />
            <ListItem icon={Globe} label="Language Selection" value="English" />
            <ListItem icon={Bell} label="Notification Preferences" />
          </Card>
        </section>

        {/* 🔹 SUPPORT SECTION */}
        <section>
          <SectionTitle>Help & Support</SectionTitle>
          <Card className="!p-2">
            <ListItem icon={HelpCircle} label="Help & Support Center" />
            <ListItem icon={BookOpen} label="App Tutorial" />
            <ListItem icon={AlertCircle} label="FAQs" />
          </Card>
        </section>

        {/* 🔹 LOGOUT BUTTON */}
        <div className="pt-6 pb-8">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full py-3.5 rounded-full border-2 border-red-500 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout of Account
          </button>
          <p className="text-center text-xs text-slate-400 mt-4 font-mono">App Version 2.4.1 (Gov Healthcare)</p>
        </div>

      </div>

      {/* BOTTOM NAVIGATION BAR */}
      {/* BOTTOM NAVIGATION BAR */}
<div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center z-40 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">

  <NavButton 
    icon={Home} 
    label="Home" 
    active={location.pathname === "/"} 
    onClick={() => navigate("/")} 
  />

  <NavButton 
    icon={Users} 
    label="Families" 
    active={location.pathname === "/families"} 
    onClick={() => navigate("/families")} 
  />

  {/* Floating Action Button */}
  <div className="relative -top-6">
    <button 
      onClick={() => navigate("/add-family")}
      className="bg-[#3087DF] text-white p-4 rounded-full shadow-lg shadow-blue-200 active:scale-95 transition-transform border-4 border-slate-50"
    >
      <PlusCircle className="w-7 h-7" />
    </button>
  </div>

  <NavButton 
    icon={FileText} 
    label="Reports" 
    active={location.pathname === "/reports"} 
    onClick={() => navigate("/reports")} 
  />

  <NavButton 
    icon={User} 
    label="Profile" 
    active={location.pathname === "/profile"} 
    onClick={() => navigate("/profile")} 
  />

</div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-500 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Logout Account?</h3>
            <p className="text-center text-slate-500 mb-6 text-sm">
              Are you sure you want to logout? You will need to enter your PIN or use biometrics to login again.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 active:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="py-3 rounded-xl font-bold text-white bg-red-500 shadow-md shadow-red-200 active:bg-red-600 transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavButton = ({ icon: Icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1 min-w-[48px] py-1 active:scale-95 transition-transform"
  >
    <Icon className={`w-6 h-6 ${active ? 'text-[#3087DF]' : 'text-slate-400'}`} />
    <span className={`text-[10px] font-medium ${active ? 'text-[#3087DF]' : 'text-slate-500'}`}>
      {label}
    </span>
  </button>
);