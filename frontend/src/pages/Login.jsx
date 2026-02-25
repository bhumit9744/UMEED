import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldPlus,
  HelpCircle,
  Info,
  Globe,
  ChevronDown,
  Check,
  BriefcaseMedical,
  IdCard,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate(); 
    
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [workerId, setWorkerId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loginState, setLoginState] = useState('idle'); // idle | loading | success

  const langRef = useRef(null);
  const languages = ['English', 'हिंदी', 'मराठी'];

  // Handle Splash Screen Transition
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
      const removeTimer = setTimeout(() => {
        setShowSplash(false);
      }, 700);
      return () => clearTimeout(removeTimer);
    }, 2000);

    return () => clearTimeout(fadeTimer);
  }, []);

  // Handle Click Outside for Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 const handleLogin = (e) => {
  e.preventDefault();

  if (!workerId || !pin) {
    alert('Please enter both Worker ID and PIN.');
    return;
  }

  setLoginState('loading');

  // Mock API Call
  setTimeout(() => {
    setLoginState('success');

    setTimeout(() => {
      navigate("/dashboard");   // ✅ REDIRECT HERE
    }, 800);

  }, 1500);
};

  return (
    <div className="bg-slate-50 text-slate-800 h-screen w-full overflow-hidden relative font-sans flex flex-col mx-auto shadow-2xl max-w-md border-x border-slate-200">
      <style>{`
        /* Custom Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.05); }
          28% { transform: scale(1); }
          42% { transform: scale(1.05); }
          70% { transform: scale(1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(25, 118, 210, 0.1);
          animation: float 8s infinite;
        }
      `}</style>

      {/* =========================
          PAGE 1: SPLASH SCREEN 
          ========================= */}
      {showSplash && (
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#E3F2FD] to-white transition-opacity duration-700 ease-out ${
            fadeSplash ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Background Particles (Decorative) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="particle w-24 h-24 top-10 left-[-20px]" style={{ animationDelay: '0s' }}></div>
            <div className="particle w-16 h-16 top-1/3 right-[-10px]" style={{ animationDelay: '2s' }}></div>
            <div className="particle w-32 h-32 bottom-20 left-10" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
            {/* Logo Container */}
            <div className="relative mb-6">
              {/* Radial Glow */}
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 transform scale-150"></div>
              
              {/* Logo Circle */}
              <div className="w-32 h-32 bg-white rounded-full shadow-[0_4px_20px_-2px_rgba(25,118,210,0.1)] flex items-center justify-center animate-heartbeat relative z-10">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1976D2]">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <path d="M12 18.5l-1.45-1.32C5.4 12.36 2.5 9.8 2.5 6.7 2.5 4.18 4.48 2.2 7 2.2c1.41 0 2.75.69 3.5 1.77.75-1.08 2.09-1.77 3.5-1.77 2.52 0 4.5 1.98 4.5 4.5 0 3.1-2.9 5.66-8.05 10.48L12 18.5z" transform="scale(0.4) translate(28, 30)" fill="#1976D2" stroke="none" className="opacity-10"></path>
                  <path d="M12 8v8M8 12h8" stroke="#1976D2" strokeWidth="2.5" />
                </svg>
              </div>
            </div>

            {/* App Name & Tagline */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-[#1976D2] tracking-tight">UMEED</h1>
              <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Smart Care. Safer Communities.</p>
            </div>
            
            {/* Loading Indicator */}
            <div className="mt-8 flex space-x-2">
              <div className="w-2 h-2 bg-[#1976D2] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#2196F3] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#BBDEFB] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pb-10 text-center z-10">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">GOV</div>
            </div>
            <p className="text-xs font-semibold text-slate-500">POWERED BY NHM</p>
            <p className="text-[10px] text-slate-400 mt-1">Version 1.0.4</p>
          </div>
        </div>
      )}

      {/* =========================
          PAGE 2: LOGIN SCREEN 
          ========================= */}
      <div className={`absolute inset-0 h-full flex flex-col bg-slate-50 transition-opacity duration-700 ${!showSplash && fadeSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Simple Top Header */}
        <header className="pt-6 px-6 pb-4 flex justify-between items-center bg-transparent z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#1976D2]">
              <ShieldPlus size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">UMEED</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-[#1976D2] p-1.5 hover:bg-blue-50 rounded-full transition">
              <HelpCircle size={22} />
            </button>
            <button className="text-[#1976D2] p-1.5 hover:bg-blue-50 rounded-full transition">
              <Info size={22} />
            </button>
            
            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition"
              >
                <Globe size={14} className="text-slate-500" />
                <span>{currentLang}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden origin-top-right transition-all duration-200">
                  {languages.map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang);
                        setLangDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1976D2] transition flex items-center justify-between"
                    >
                      <span>{lang}</span>
                      {currentLang === lang && <Check size={14} className="text-[#1976D2]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-6 pt-2 pb-6">
          
          <div className="mb-8 mt-2">
            <h2 className="text-[28px] font-bold text-slate-900 leading-tight">Welcome Back</h2>
            <p className="text-slate-500 text-[15px] mt-2 leading-relaxed max-w-[85%]">Enter your details to access family health records.</p>
          </div>

          {/* Main Auth Card */}
          <div className="bg-white rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] p-6 relative overflow-hidden border border-slate-100">
            {/* Decorative blurred blob inside card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1976D2] mb-4 shadow-sm border border-blue-50">
                <BriefcaseMedical size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">AshaWorker Connect</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">Authentication Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Worker ID Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Worker ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1976D2] transition-colors">
                    <IdCard size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={workerId}
                    onChange={(e) => setWorkerId(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#2196F3]/20 focus:border-[#2196F3] transition-all outline-none font-medium bg-slate-50/50 focus:bg-white" 
                    placeholder="Enter your ID"
                  />
                </div>
              </div>

              {/* PIN Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">PIN</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1976D2] transition-colors">
                    <Lock size={20} />
                  </div>
                  <input 
                    type={showPin ? "text" : "password"} 
                    maxLength="6" 
                    inputMode="numeric" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className={`block w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#2196F3]/20 focus:border-[#2196F3] transition-all outline-none font-medium bg-slate-50/50 focus:bg-white ${!showPin ? 'tracking-[0.5em]' : ''}`} 
                    placeholder="Enter 6-digit PIN"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#1976D2] cursor-pointer"
                  >
                    {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loginState !== 'idle'}
                  className={`w-full text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    loginState === 'success' 
                      ? 'bg-green-600 shadow-green-500/20' 
                      : 'bg-[#1976D2] hover:bg-[#1565C0] active:scale-[0.98] shadow-blue-500/20'
                  } ${loginState === 'loading' ? 'opacity-80' : ''}`}
                >
                  {loginState === 'idle' && <span>Log In</span>}
                  {loginState === 'loading' && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {loginState === 'success' && (
                    <>
                      <span>Success!</span>
                      <Check size={20} />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Forgot PIN Link */}
          <div className="text-center mt-6">
            <button 
              onClick={() => alert('Please contact your district supervisor to reset your PIN.')} 
              className="text-sm font-medium text-[#1976D2] hover:text-[#1565C0] transition"
            >
              Forgot PIN? Contact Supervisor
            </button>
          </div>

        </main>

        {/* Bottom Footer */}
        <footer className="pb-6 text-center">
          <p className="text-[11px] font-medium text-slate-400">v1.0.4 • Build 2024.10</p>
        </footer>
      </div>

    </div>
  );
}