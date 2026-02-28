import React, { useState } from 'react';
import { ChevronLeft, CheckSquare, Square, ClipboardList } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// --- MOCK DATA ---
const initialPatients = [
  {
    id: 1,
    name: "Ramesh Kumar",
    age: 54,
    village: "Phulwari",
    conditions: ["Hypertension", "Diabetes"],
    lastVisit: "12 Jan 2026",
    dueDate: "12 Feb 2026",
    status: "overdue",
    isCompleted: false
  },
  {
    id: 2,
    name: "Sunita Devi",
    age: 48,
    village: "Rampur",
    conditions: ["Thyroid"],
    lastVisit: "24 Jan 2026",
    dueDate: "24 Feb 2026",
    status: "today",
    isCompleted: false
  },
  {
    id: 3,
    name: "Mohammad Ali",
    age: 62,
    village: "Phulwari",
    conditions: ["Asthma", "Hypertension"],
    lastVisit: "10 Jan 2026",
    dueDate: "10 Feb 2026",
    status: "overdue",
    isCompleted: false
  },
  {
    id: 4,
    name: "Geeta Bai",
    age: 50,
    village: "Kusumpur",
    conditions: ["Diabetes"],
    lastVisit: "24 Jan 2026",
    dueDate: "24 Feb 2026",
    status: "today",
    isCompleted: false
  },
  {
    id: 5,
    name: "Kishan Singh",
    age: 58,
    village: "Rampur",
    conditions: ["Hypertension"],
    lastVisit: "28 Jan 2026",
    dueDate: "28 Feb 2026",
    status: "upcoming",
    isCompleted: false
  }
];

export default function NcdFollowups() {
  
  const navigate = useNavigate();
  const [patients, setPatients] = useState(initialPatients);
  const [activeFilter, setActiveFilter] = useState('All');

  // --- LOGIC ---
  const toggleComplete = (id) => {
    setPatients(patients.map(p => 
      p.id === id ? { ...p, isCompleted: !p.isCompleted } : p
    ));
  };

  const filteredPatients = patients.filter(p => {
    if (activeFilter === 'Due Today') return p.status === 'today';
    if (activeFilter === 'Overdue') return p.status === 'overdue';
    return true; // 'All'
  });

  // --- COMPONENTS ---
  const Header = () => (
    <div className="bg-white pt-4 pb-2 px-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <button className="p-1 -ml-1 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">NCD Follow-ups</h1>
          <p className="text-sm text-gray-500">Patients requiring follow-up visit</p>
        </div>
      </div>
    </div>
  );

  const SummaryStrip = () => (
    <div className="bg-[#3087DF]/10 px-4 py-3 border-b border-[#3087DF]/20">
      <p className="text-[#3087DF] font-medium text-sm">
        Total Follow-ups: {filteredPatients.length}
      </p>
    </div>
  );

  const FilterTabs = () => (
    <div className="px-4 py-4">
      <div className="flex bg-gray-200/60 rounded-[16px] p-1">
        {['All', 'Due Today', 'Overdue'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-[12px] transition-all ${
              activeFilter === tab
                ? 'bg-[#3087DF] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const PatientCard = ({ patient }) => {
    const { name, age, village, conditions, lastVisit, dueDate, status, isCompleted } = patient;
    
    // Determine badge styling and text based on status
    let badgeStyle = "bg-gray-100 text-gray-700";
    let badgeText = "Upcoming";
    
    if (isCompleted) {
      badgeStyle = "bg-green-100 text-green-700";
      badgeText = "Completed";
    } else if (status === 'overdue') {
      badgeStyle = "bg-red-100 text-red-700";
      badgeText = "Overdue";
    } else if (status === 'today') {
      badgeStyle = "bg-orange-100 text-orange-700";
      badgeText = "Due Today";
    }

    return (
      <div className={`bg-white rounded-[16px] shadow-sm p-4 mb-4 border border-gray-100 transition-all ${isCompleted ? 'opacity-60 bg-gray-50/50' : ''}`}>
        <div className="flex gap-4">
          
          {/* Left: Avatar */}
          <div className="w-12 h-12 rounded-full bg-[#3087DF]/10 text-[#3087DF] flex items-center justify-center font-bold text-xl shrink-0">
            {name.charAt(0)}
          </div>

          {/* Right: Content */}
          <div className="flex-1 flex flex-col gap-1.5">
            
            {/* Row 1: Name & Age + Badge */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 text-[16px] leading-tight">{name}</h3>
                <span className="text-sm text-gray-600">{age} yrs</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-1 rounded-md tracking-wide ${badgeStyle}`}>
                {badgeText}
              </span>
            </div>

            {/* Row 2: Village */}
            <p className="text-sm text-gray-500 font-medium">{village}</p>

            {/* Row 3: Condition Tags */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {conditions.map((condition, idx) => (
                <span key={idx} className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
                  {condition}
                </span>
              ))}
            </div>

            {/* Row 4: Dates */}
            <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Last Visit</p>
                <p className="text-xs text-gray-700 font-medium">{lastVisit}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Next Due</p>
                <p className={`text-xs font-bold ${status === 'overdue' && !isCompleted ? 'text-red-600' : 'text-gray-900'}`}>
                  {dueDate}
                </p>
              </div>
            </div>

            {/* Action: Checkbox aligned right */}
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => toggleComplete(patient.id)}
                className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
                  isCompleted 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-[#3087DF] bg-[#3087DF]/10 hover:bg-[#3087DF]/20'
                }`}
              >
                {isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                {isCompleted ? 'Visit Done' : 'Mark Visit Done'}
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <ClipboardList size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No pending NCD follow-ups.</h3>
      <p className="text-sm text-gray-500">
        {activeFilter === 'All' 
          ? "You're all caught up with your patients." 
          : `No patients found for '${activeFilter}'.`}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-8 max-w-md mx-auto shadow-xl relative overflow-hidden selection:bg-[#3087DF]/20">
      <Header />
      <SummaryStrip />
      <FilterTabs />
      
      <div className="px-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}