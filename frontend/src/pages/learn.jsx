import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Heart, Activity, Baby, ShieldAlert, Home, User, Users, Plus,
  Flame, Star, Award, ChevronLeft, Bookmark, CheckCircle, Zap, WifiOff,
  Image as ImageIcon, ArrowRight, Share2, Stethoscope
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

// --- GAMIFIED MOCK DATA ---
const HIGH_RISK_LESSON = {
  id: 'hr_preg_1',
  title: 'High-Risk Pregnancy: Quick Signs',
  category: 'Maternal Care',
  cards: [
    {
      id: 'c1', type: 'info', tag: '⚠️ Warning Sign', tagColor: 'text-amber-600 bg-amber-50',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600&h=600',
      text: 'Swelling in the face or hands may indicate high blood pressure.'
    },
    {
      id: 'c2', type: 'info', tag: '📌 Important', tagColor: 'text-red-600 bg-red-50',
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=600&h=600',
      text: 'BP above 140/90 is considered high-risk during pregnancy.'
    },
    {
      id: 'c3', type: 'info', tag: '🚑 Action Step', tagColor: 'text-[#3087DF] bg-[#3087DF]/10',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=600',
      text: 'Refer immediately to PHC if BP remains high after 5 minutes.'
    },
    {
      id: 'c4', type: 'checklist', tag: '📝 Checklist', tagColor: 'text-emerald-600 bg-emerald-50',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600&h=600',
      text: 'Ensure:',
      points: ['Regular ANC visits', 'Daily Iron (IFA) tablets', 'BP check every visit']
    },
    {
      id: 'c5', type: 'quiz', tag: '🧠 Quick Check', tagColor: 'text-purple-600 bg-purple-50',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600&h=600',
      question: 'What is sudden facial swelling a sign of?',
      options: ['Normal pregnancy swelling', 'High Blood Pressure', 'Low blood sugar', 'Viral Fever'],
      answerIdx: 1
    },
    {
      id: 'c6', type: 'info', tag: '💡 Field Tip', tagColor: 'text-orange-600 bg-orange-50',
      image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=600&h=600',
      text: 'Educate families about early warning signs to prevent severe complications.'
    }
  ]
};

const CATEGORIES = [
  { id: 1, title: 'Maternal Care', subtitle: '12 Topics', progress: 65, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=400&h=300', lesson: HIGH_RISK_LESSON },
  { id: 2, title: 'Child Health', subtitle: '8 Topics', progress: 30, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400&h=300', lesson: {
      id: 'ch_1', title: 'Newborn Care Basics', category: 'Child Health', cards: [
        { id: 'ch_c1', type: 'info', tag: '👶 Basics', tagColor: 'text-blue-600 bg-blue-50', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600&h=600', text: 'Keep the baby warm and initiate breastfeeding within 1 hour.' },
        { id: 'ch_c2', type: 'checklist', tag: '📝 Checklist', tagColor: 'text-emerald-600 bg-emerald-50', image: 'https://images.unsplash.com/photo-1555252834-31ea8124f2b0?auto=format&fit=crop&q=80&w=600&h=600', text: 'First 24 Hours:', points: ['Breastfeeding', 'Skin-to-skin contact', 'Delay bathing'] }
      ]
  } },
  { id: 3, title: 'Nutrition', subtitle: '5 Topics', progress: 0, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400&h=300', lesson: {
      id: 'nu_1', title: 'Iron & Folic Acid', category: 'Nutrition', cards: [
        { id: 'nu_c1', type: 'info', tag: '🥗 Diet', tagColor: 'text-green-600 bg-green-50', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600&h=600', text: 'Encourage pregnant women to eat green leafy vegetables and take IFA supplements.' }
      ]
  } },
  { id: 4, title: 'Emergency Care', subtitle: '4 Topics', progress: 100, image: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=400&h=300', lesson: {
      id: 'em_1', title: 'Bleeding Protocols', category: 'Emergency Care', cards: [
        { id: 'em_c1', type: 'info', tag: '🚑 Action Step', tagColor: 'text-red-600 bg-red-50', image: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=600&h=600', text: 'Severe bleeding requires immediate referral to the nearest FRU. Do not delay.' }
      ]
  } },
];

export default function Learn() {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('learn');
  const [activeLesson, setActiveLesson] = useState(null);
  
  // Lifted State for Progress Tracking
  const [points, setPoints] = useState(1450);
  const [streak, setStreak] = useState(3);
  const [dailyCompleted, setDailyCompleted] = useState(3);
  const dailyGoal = 5;

  const handleCompleteLesson = () => {
    setDailyCompleted(prev => Math.min(prev + 1, dailyGoal));
    setPoints(prev => prev + 10);
    setActiveLesson(null);
  };

  const handleAddPoints = (amount) => {
    setPoints(prev => prev + amount);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans max-w-md mx-auto relative shadow-2xl overflow-x-hidden">
      
      {/* Dynamic View Rendering */}
      <main className="pb-[84px]">
        {activeTab === 'learn' && !activeLesson && (
          <LearnDashboard 
            onStartLesson={(lesson) => setActiveLesson(lesson)} 
            points={points}
            streak={streak}
            dailyCompleted={dailyCompleted}
            dailyGoal={dailyGoal}
          />
        )}
        {activeTab === 'learn' && activeLesson && (
          <SwipeableLesson 
            lesson={activeLesson} 
            onClose={() => setActiveLesson(null)} 
            onComplete={handleCompleteLesson}
            onAddPoints={handleAddPoints}
          />
        )}
        {activeTab !== 'learn' && (
          <div className="flex items-center justify-center h-screen text-slate-400">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content
          </div>
        )}
      </main>

        {/* Persistent Bottom Navigation (Hidden during active lesson) */}
      {!activeLesson && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 grid grid-cols-5 items-center h-[68px] z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <NavButton 
  icon={Home} 
  label="Home" 
  active={activeTab === 'home'} 
  onClick={() => navigate("/")} 
/>

<NavButton 
  icon={Users} 
  label="Families" 
  active={activeTab === 'families'} 
  onClick={() => navigate("/families")} 
/>


          
          <div className="relative flex justify-center items-start h-full">
            <button 
            onClick={() => navigate("/add-family")}
            className="absolute -top-5 bg-[#3b82f6] text-white w-[58px] h-[58px] rounded-full flex items-center justify-center border-[4px] border-white shadow-[0_8px_16px_-4px_rgba(59,130,246,0.5)] active:scale-95 transition-transform hover:bg-[#2563eb]">
              <Plus className="w-7 h-7" strokeWidth={2.5} />
            </button>
          </div>

          <NavButton icon={BookOpen} label="Learn" active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} />
         <NavButton 
  icon={Stethoscope} 
  label="Doctor" 
  active={activeTab === 'doctor'} 
  onClick={() => {
    setActiveTab("doctor");
    navigate("/esanjeevni");
  }} 
/> 

        </div>
      )}

      {/* Global CSS Overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .slide-left { animation: slideLeft 0.3s ease-out forwards; }
        .slide-right { animation: slideRight 0.3s ease-out forwards; }
        @keyframes slideLeft { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideRight { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .confetti { position: absolute; width: 8px; height: 8px; background-color: #4ade80; border-radius: 50%; animation: fall 1.5s ease-out forwards; }
        @keyframes fall { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(100px) scale(0); opacity: 0; } }
      `}} />
    </div>
  );
}

// --- 1. DASHBOARD VIEW ---
function LearnDashboard({ onStartLesson, points, streak, dailyCompleted, dailyGoal }) {
  const progressPercent = Math.min((dailyCompleted / dailyGoal) * 100, 100);

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* Top Header Section */}
      <div className="bg-white px-5 pt-10 pb-5 border-b border-slate-200 sticky top-0 z-30 shadow-sm flex flex-col">
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full border border-orange-100 shadow-sm transition-all duration-300">
              <Flame className="w-4 h-4 mr-1 fill-current" />
              <span className="font-bold text-sm">{streak}</span>
            </div>
            <div className="flex items-center bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full border border-yellow-100 shadow-sm transition-all duration-300">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="font-bold text-sm">{points}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
            <span>Daily Goal</span>
            <span className="text-[#3087DF]">{dailyCompleted} / {dailyGoal} Topics</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#3087DF] rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">

        {/* Featured Card */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center">
            <Star className="w-4 h-4 text-[#3087DF] mr-1.5" /> Today's Quick Learning
          </h2>
          <div 
            className="relative h-[220px] rounded-[16px] overflow-hidden shadow-md group cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => onStartLesson(HIGH_RISK_LESSON)}
          >
            <img src={HIGH_RISK_LESSON.cards[0].image} alt="Featured" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded mb-2 border border-white/20">
                2 Min • {HIGH_RISK_LESSON.cards.length} Cards
              </span>
              <h3 className="font-bold text-xl text-white mb-3 leading-tight drop-shadow-md">
                {HIGH_RISK_LESSON.title}
              </h3>
              <button className="w-full bg-[#3087DF] hover:bg-[#2563eb] text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center text-sm">
                Start Learning <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Explore Categories</h2>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => cat.lesson && onStartLesson(cat.lesson)}
                className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer active:scale-95 group"
              >
                <div className="h-28 relative overflow-hidden bg-slate-100">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                  {cat.progress === 100 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-sm">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  )}
                  <span className="absolute bottom-2 left-3 font-bold text-white text-sm drop-shadow-md">{cat.title}</span>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-semibold text-slate-500">{cat.subtitle}</span>
                    <span className={`text-[10px] font-bold ${cat.progress === 100 ? 'text-green-600' : 'text-[#3087DF]'}`}>{cat.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cat.progress === 100 ? 'bg-green-500' : 'bg-[#3087DF]'}`} style={{width: `${cat.progress}%`}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- 2. FULL SCREEN LESSON COMPONENT ---
function SwipeableLesson({ lesson, onClose, onComplete, onAddPoints }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState('none');
  const [flashMode, setFlashMode] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [toast, setToast] = useState(null);
  const [savedCards, setSavedCards] = useState(new Set());

  const card = lesson.cards[currentIdx];
  const isLastCard = currentIdx === lesson.cards.length - 1;

  // Handlers
  const handleNext = () => {
    if (isLastCard) {
      showToast('Lesson Completed! +10 Points 🏆');
      setTimeout(() => {
        onComplete();
      }, 2000);
      return;
    }
    setDirection('slide-left');
    setCardFlipped(false);
    setTimeout(() => {
      setCurrentIdx(prev => prev + 1);
      setDirection('none');
    }, 50); // Small delay for React render to catch class reset
  };

  const handlePrev = () => {
    if (currentIdx === 0) return;
    setDirection('slide-right');
    setCardFlipped(false);
    setTimeout(() => {
      setCurrentIdx(prev => prev - 1);
      setDirection('none');
    }, 50);
  };

  const handleQuiz = (idx) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    if (idx === card.answerIdx) {
      showToast('Correct! +5 Points ⭐');
      triggerConfetti();
      onAddPoints(5); // Update global points
    } else {
      showToast('Review card carefully.');
    }
  };

  const toggleSave = () => {
    const newSaved = new Set(savedCards);
    if (newSaved.has(card.id)) newSaved.delete(card.id);
    else newSaved.add(card.id);
    setSavedCards(newSaved);
    showToast(newSaved.has(card.id) ? 'Card Saved 🔖' : 'Removed from Saved');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const triggerConfetti = () => {
    // Basic CSS confetti logic handled via React state render in UI
  };

  // Touch Swiping logic
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) handleNext(); // swipe left
    if (touchStart - touchEnd < -50) handlePrev(); // swipe right
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col max-w-md mx-auto animate-in fade-in duration-300">
      
      {/* Toast Overlay */}
      {toast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-full shadow-2xl z-50 flex items-center space-x-2 animate-in slide-in-from-top-2 fade-in duration-300">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm font-bold whitespace-nowrap">{toast}</span>
        </div>
      )}

      {/* Confetti container for quiz */}
      {quizAnswered && card.type === 'quiz' && (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 0.5}s`
            }}></div>
          ))}
        </div>
      )}

      {/* Fullscreen Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm z-30 relative">
        <button onClick={onClose} className="p-2 bg-slate-100 text-slate-600 rounded-full active:scale-95 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center px-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{lesson.category}</h2>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#3087DF] transition-all duration-300" style={{width: `${((currentIdx + 1) / lesson.cards.length) * 100}%`}}></div>
          </div>
        </div>
        <button onClick={() => setFlashMode(!flashMode)} className={`p-2 rounded-full font-bold text-xs border active:scale-95 transition-colors ${flashMode ? 'bg-[#3087DF] text-white border-[#3087DF]' : 'bg-white text-slate-500 border-slate-200'}`}>
          Flash
        </button>
      </div>

      {/* Main Swipeable Area */}
      <div 
        className="flex-1 relative overflow-hidden flex items-center justify-center p-5"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          key={currentIdx} // Force re-render for animation
          className={`w-full h-full max-h-[600px] bg-white rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden relative ${direction}`}
          onClick={() => flashMode && setCardFlipped(!cardFlipped)}
        >
          {/* Card Image Header */}
          <div className="relative h-[45%] bg-slate-100 flex-shrink-0">
            <img src={card.image} alt="Lesson visual" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleSave(); }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 active:scale-95"
              >
                <Bookmark className={`w-5 h-5 ${savedCards.has(card.id) ? 'fill-white text-white' : 'text-white'}`} />
              </button>
            </div>
            
            <div className="absolute bottom-4 left-4">
               <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${card.tagColor}`}>
                {card.tag}
              </span>
            </div>
          </div>

          {/* Card Content Area */}
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto relative hide-scrollbar">
            
            {/* Flash Mode Logic */}
            {flashMode && !cardFlipped ? (
              <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                <ImageIcon className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Tap to reveal info</h3>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300 w-full min-h-full flex flex-col justify-center">
                
                {/* Info Card */}
                {card.type === 'info' && (
                  <p className="text-2xl font-bold text-slate-800 leading-snug">{card.text}</p>
                )}

                {/* Checklist Card */}
                {card.type === 'checklist' && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{card.text}</h3>
                    <ul className="space-y-4">
                      {card.points.map((pt, i) => (
                        <li key={i} className="flex items-center text-lg font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quiz Card */}
                {card.type === 'quiz' && (
                  <div className="w-full py-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{card.question}</h3>
                    <div className="space-y-2.5">
                      {card.options.map((opt, i) => {
                        let btnClass = "border-slate-200 text-slate-600 bg-white hover:border-[#3087DF]";
                        if (quizAnswered) {
                          if (i === card.answerIdx) btnClass = "border-green-500 bg-green-50 text-green-700 font-bold shadow-md";
                          else btnClass = "border-slate-200 bg-slate-50 text-slate-400"; // Improved visibility by removing opacity-50
                        }
                        return (
                          <button
                            key={i}
                            disabled={quizAnswered}
                            onClick={(e) => { e.stopPropagation(); handleQuiz(i); }}
                            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${btnClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-white border-t border-slate-200 p-5 flex items-center justify-between pb-8">
        <div className="flex space-x-1.5">
          {lesson.cards.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentIdx ? 'w-6 bg-[#3087DF]' : 'w-2 bg-slate-200'}`}></div>
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          className="bg-[#3087DF] hover:bg-[#2563eb] text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-[#3087DF]/30 active:scale-95 transition-all flex items-center"
        >
          {isLastCard ? 'Complete' : 'Next'} <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>

    </div>
  );
}

// --- SHARED COMPONENTS ---
function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full group bg-transparent">
      <div className={`transition-all duration-300 flex items-center justify-center mb-1 ${active ? 'text-[#3b82f6]' : 'text-[#94a3b8]'}`}>
        <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={`text-[11px] font-semibold tracking-wide transition-colors ${active ? 'text-[#3b82f6]' : 'text-[#94a3b8]'}`}>
        {label}
      </span>
    </button>
  );
}