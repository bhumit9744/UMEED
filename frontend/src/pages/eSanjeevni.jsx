import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Video, Plus, Clock, AlertCircle, X, 
  ChevronDown, Search, Filter, Star, CheckCircle, 
  Calendar, PhoneCall, UserPlus, PhoneOff, Camera, Mic
} from 'lucide-react';

// --- MOCK DATA ---
const DOCTORS = [
  { id: 'd1', name: 'Dr. Sharma', spec: 'Cardiologist', hospital: 'District Hospital', status: 'Online', rating: 4.8 },
  { id: 'd2', name: 'Dr. Iyer', spec: 'Gynecologist', hospital: 'Women & Child Care', status: 'Online', rating: 4.9 },
  { id: 'd3', name: 'Dr. Khan', spec: 'Pediatrician', hospital: 'City Clinic', status: 'Offline', rating: 4.7 },
  { id: 'd4', name: 'Dr. Rao', spec: 'General Physician', hospital: 'Community Center', status: 'Online', rating: 4.5 },
  { id: 'd5', name: 'Dr. Patel', spec: 'Endocrinologist', hospital: 'District Hospital', status: 'Offline', rating: 4.6 },
];

const DISEASE_TO_SPEC_MAP = {
  'Hypertension': 'Cardiologist',
  'High Risk Pregnancy': 'Gynecologist',
  'Child Malnutrition': 'Pediatrician',
  'Diabetes': 'Endocrinologist',
  'Asthma': 'General Physician',
  'Severe Anemia': 'General Physician',
  'Skin Infection': 'General Physician'
};

const INITIAL_CONSULTATIONS = [
  {
    id: 'c1',
    patientName: 'Sita Devi',
    age: 45,
    village: 'Rampur',
    diseaseTags: ['Hypertension', 'Diabetes'],
    priority: 'High',
    status: 'Not Started',
    assignedDoctorId: null,
    waitingTime: '10m',
    referralRecommended: false,
  },
  {
    id: 'c2',
    patientName: 'Rani Kumari',
    age: 26,
    village: 'Shivpur',
    diseaseTags: ['High Risk Pregnancy', 'Severe Anemia'],
    priority: 'High',
    status: 'Scheduled',
    assignedDoctorId: 'd2',
    waitingTime: '-',
    referralRecommended: true,
  },
  {
    id: 'c3',
    patientName: 'Aarav',
    age: 4,
    village: 'Rampur',
    diseaseTags: ['Child Malnutrition'],
    priority: 'Moderate',
    status: 'In Progress',
    assignedDoctorId: 'd3',
    waitingTime: 'Ongoing',
    referralRecommended: false,
  },
  {
    id: 'c4',
    patientName: 'Mohan Lal',
    age: 62,
    village: 'Kishanpur',
    diseaseTags: ['Asthma'],
    priority: 'Routine',
    status: 'Completed',
    assignedDoctorId: 'd4',
    waitingTime: '-',
    referralRecommended: false,
  }
];

const AVAILABLE_PATIENTS = ['Suresh Kumar', 'Gita Bai', 'Ramesh Singh', 'Pooja Verma'];
const AVAILABLE_DISEASES = Object.keys(DISEASE_TO_SPEC_MAP);

// --- MAIN COMPONENT ---
export default function App() {
  const [consultations, setConsultations] = useState(INITIAL_CONSULTATIONS);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modals state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeCall, setActiveCall] = useState(null);

  // Derived & Filtered Data
  const filteredAndSortedConsultations = useMemo(() => {
    let filtered = consultations;
    if (activeFilter !== 'All') {
      if (['High', 'Moderate', 'Routine'].includes(activeFilter)) {
        filtered = consultations.filter(c => c.priority === activeFilter);
      } else if (['Not Started', 'Scheduled', 'In Progress', 'Completed'].includes(activeFilter)) {
        filtered = consultations.filter(c => c.status === activeFilter);
      } else {
        filtered = consultations.filter(c => c.diseaseTags.includes(activeFilter));
      }
    }

    // Sort: High priority first, then others
    return filtered.sort((a, b) => {
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (a.priority !== 'High' && b.priority === 'High') return 1;
      return 0;
    });
  }, [consultations, activeFilter]);

  const stats = {
    pending: consultations.filter(c => c.status !== 'Completed').length,
    completed: consultations.filter(c => c.status === 'Completed').length
  };

  // Handlers
  const handleAssignDoctor = (consultationId, doctorId) => {
    setConsultations(prev => prev.map(c => {
      if (c.id === consultationId) {
        const doc = DOCTORS.find(d => d.id === doctorId);
        return { 
          ...c, 
          assignedDoctorId: doctorId, 
          status: doc.status === 'Online' ? 'Not Started' : 'Scheduled' 
        };
      }
      return c;
    }));
    setAssignModalOpen(false);
  };

  const handleAddConsultation = (newConsultation) => {
    setConsultations(prev => [{...newConsultation, id: `c${Date.now()}`}, ...prev]);
    setAddModalOpen(false);
  };

  const updateStatus = (id, newStatus) => {
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleStartCall = (consultation) => {
    updateStatus(consultation.id, 'In Progress');
    setActiveCall(consultation);
  };

  const handleEndCall = (id) => {
    updateStatus(id, 'Completed');
    setActiveCall(null);
  };

  if (activeCall) {
    return <VideoCallView consultation={activeCall} onEndCall={handleEndCall} />;
  }

  return (
    <div className="mx-auto max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans">
      
      {/* HEADER SECTION */}
      <header className="bg-white px-4 pt-6 pb-4 sticky top-0 z-10 shadow-sm rounded-b-[24px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">eSanjeevni</h1>
              <p className="text-xs text-gray-500 font-medium">Online Specialist Consultation</p>
            </div>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="bg-[#3087DF]/10 rounded-[16px] p-3 flex justify-between items-center border border-[#3087DF]/20">
          <div className="flex flex-col">
            <span className="text-xs text-[#3087DF] font-semibold uppercase tracking-wider">Pending</span>
            <span className="text-xl font-bold text-[#3087DF]">{stats.pending}</span>
          </div>
          <div className="h-8 w-px bg-[#3087DF]/20"></div>
          <div className="flex flex-col text-right">
            <span className="text-xs text-[#3087DF] font-semibold uppercase tracking-wider">Completed</span>
            <span className="text-xl font-bold text-[#3087DF]">{stats.completed}</span>
          </div>
        </div>
      </header>

      {/* FILTERS */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {['All', 'High', 'Not Started', 'Pregnancy'].map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === f 
                ? 'bg-[#3087DF] text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* MAIN SECTION: PATIENT LIST */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {filteredAndSortedConsultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center mt-10">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No scheduled consultations</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">You're all caught up for now.</p>
            <button 
              onClick={() => setAddModalOpen(true)}
              className="bg-[#3087DF] text-white px-6 py-2.5 rounded-xl font-medium shadow-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Consultation
            </button>
          </div>
        ) : (
          filteredAndSortedConsultations.map(consultation => (
            <PatientCard 
              key={consultation.id} 
              data={consultation} 
              onAssignClick={() => {
                setSelectedConsultationId(consultation.id);
                setAssignModalOpen(true);
              }}
              onStatusUpdate={updateStatus}
              onStartCall={handleStartCall}
            />
          ))
        )}
      </main>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setAddModalOpen(true)}
        className="absolute bottom-6 right-6 bg-[#3087DF] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-transform active:scale-95 z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* MODALS */}
      {assignModalOpen && selectedConsultationId && (
        <AssignDoctorModal 
          consultation={consultations.find(c => c.id === selectedConsultationId)}
          onClose={() => setAssignModalOpen(false)}
          onAssign={handleAssignDoctor}
        />
      )}

      {addModalOpen && (
        <AddConsultationModal 
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddConsultation}
        />
      )}

    </div>
  );
}

// --- SUB-COMPONENTS ---

function PatientCard({ data, onAssignClick, onStatusUpdate, onStartCall }) {
  const doctor = data.assignedDoctorId ? DOCTORS.find(d => d.id === data.assignedDoctorId) : null;

  const statusColors = {
    'Not Started': 'bg-gray-100 text-gray-600 border-gray-200',
    'Scheduled': 'bg-blue-50 text-blue-600 border-blue-200',
    'In Progress': 'bg-orange-50 text-orange-600 border-orange-200',
    'Completed': 'bg-green-50 text-green-600 border-green-200',
  };

  const priorityColors = {
    'High': 'text-red-600 bg-red-50 border-red-100',
    'Moderate': 'text-amber-600 bg-amber-50 border-amber-100',
    'Routine': 'text-green-600 bg-green-50 border-green-100',
  };

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 mb-4 relative overflow-hidden">
      {/* High Priority Accent Line */}
      {data.priority === 'High' && (
        <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
      )}

      {/* Top Row: Profile & Basic Info */}
      <div className="flex justify-between items-start mb-3 pl-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg border-2 border-white shadow-sm">
            {data.patientName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">{data.patientName}</h3>
            <p className="text-xs text-gray-500 font-medium">{data.age} yrs • {data.village}</p>
          </div>
        </div>
        <div className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide border ${statusColors[data.status]}`}>
          {data.status}
        </div>
      </div>

      {/* Disease Tags & Priority */}
      <div className="flex flex-wrap gap-1.5 mb-4 pl-1">
        <span className={`text-[10px] px-2 py-1 rounded-md font-semibold border ${priorityColors[data.priority]}`}>
          {data.priority} Priority
        </span>
        {data.diseaseTags.map(tag => (
          <span key={tag} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
            {tag}
          </span>
        ))}
        {data.referralRecommended && (
          <span className="text-[10px] px-2 py-1 bg-rose-50 text-rose-600 rounded-md font-semibold flex items-center gap-1 border border-rose-100">
            <AlertCircle className="w-3 h-3" /> Referral Recommended
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100 mb-4"></div>

      {/* Doctor & Action Area */}
      <div className="flex items-center justify-between pl-1">
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Assigned Doctor</p>
          {doctor ? (
            <div>
              <p className="font-bold text-gray-900 text-sm">{doctor.name}</p>
              <p className="text-xs text-gray-500">{doctor.spec}</p>
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-400 italic">Doctor Not Assigned</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {!doctor ? (
            <button 
              onClick={onAssignClick}
              className="bg-[#3087DF]/10 text-[#3087DF] px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-[#3087DF]/20 transition-colors"
            >
              Assign
            </button>
          ) : (
            <>
              {data.status === 'Completed' ? (
                <span className="text-green-500 text-sm font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Done
                </span>
              ) : data.status === 'In Progress' ? (
                <button 
                  onClick={() => onStartCall(data)}
                  className="bg-orange-500 text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-1"
                >
                  <Video className="w-4 h-4" /> Join Call
                </button>
              ) : doctor.status === 'Online' ? (
                <button 
                  onClick={() => onStartCall(data)}
                  className="bg-[#3087DF] text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-1"
                >
                  <PhoneCall className="w-4 h-4" /> Start
                </button>
              ) : (
                <button 
                  onClick={() => onStatusUpdate(data.id, 'Scheduled')}
                  className="bg-gray-100 text-gray-700 px-4 py-1.5 border border-gray-200 rounded-xl text-sm font-bold shadow-sm flex items-center gap-1"
                >
                  <Calendar className="w-4 h-4" /> Schedule
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AssignDoctorModal({ consultation, onClose, onAssign }) {
  // Smart Feature: Determine needed specialties based on disease tags
  const neededSpecs = consultation.diseaseTags.map(tag => DISEASE_TO_SPEC_MAP[tag]).filter(Boolean);
  
  // Sort doctors: Suggested first, then online, then offline
  const sortedDoctors = [...DOCTORS].sort((a, b) => {
    const aSuggested = neededSpecs.includes(a.spec);
    const bSuggested = neededSpecs.includes(b.spec);
    
    if (aSuggested && !bSuggested) return -1;
    if (!aSuggested && bSuggested) return 1;
    if (a.status === 'Online' && b.status === 'Offline') return -1;
    if (a.status === 'Offline' && b.status === 'Online') return 1;
    return b.rating - a.rating; // Highest rated first among equals
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md sm:rounded-[24px] rounded-t-[24px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
        
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Assign Doctor</h2>
            <p className="text-xs text-gray-500">For {consultation.patientName} • {consultation.diseaseTags.join(', ')}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 bg-gray-50 space-y-3">
          {sortedDoctors.map(doctor => {
            const isSuggested = neededSpecs.includes(doctor.spec);
            
            return (
              <div key={doctor.id} className="bg-white p-3 rounded-[16px] border border-gray-100 shadow-sm relative overflow-hidden">
                {isSuggested && (
                   <div className="absolute top-0 right-0 bg-[#3087DF]/10 text-[#3087DF] text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                     Suggested Match
                   </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                     <div className="relative">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${doctor.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                     </div>
                     <div>
                       <h4 className="font-bold text-gray-900">{doctor.name}</h4>
                       <p className="text-xs text-[#3087DF] font-medium">{doctor.spec}</p>
                       <p className="text-[10px] text-gray-500">{doctor.hospital}</p>
                     </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-12">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" /> {doctor.rating}
                    </div>
                    <button 
                      onClick={() => onAssign(consultation.id, doctor.id)}
                      className="bg-[#3087DF] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AddConsultationModal({ onClose, onAdd }) {
  const [patient, setPatient] = useState('');
  const [tags, setTags] = useState([]);
  const [priority, setPriority] = useState('Routine');
  const [note, setNote] = useState('');

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = () => {
    if (!patient || tags.length === 0) return;
    onAdd({
      patientName: patient,
      age: Math.floor(Math.random() * 40) + 20, // Mock age
      village: 'Rampur', // Mock village
      diseaseTags: tags,
      priority,
      status: 'Not Started',
      assignedDoctorId: null,
      waitingTime: '-',
      referralRecommended: priority === 'High',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md sm:rounded-[24px] rounded-t-[24px] overflow-hidden shadow-2xl flex flex-col animate-slide-up">
        
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Add Teleconsultation</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Patient Select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Select Patient</label>
            <div className="relative">
              <select 
                value={patient} 
                onChange={e => setPatient(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3087DF]/50"
              >
                <option value="" disabled>Select from village list...</option>
                {AVAILABLE_PATIENTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Disease Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Symptoms / Disease</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_DISEASES.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                    tags.includes(tag) 
                      ? 'bg-[#3087DF]/10 border-[#3087DF] text-[#3087DF]' 
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['Routine', 'Moderate', 'High'].map(level => (
                <button
                  key={level}
                  onClick={() => setPriority(level)}
                  className={`py-2 rounded-xl text-sm font-bold border transition-colors ${
                    priority === level
                      ? level === 'High' ? 'bg-red-50 border-red-200 text-red-600'
                        : level === 'Moderate' ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-green-50 border-green-200 text-green-600'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Short Complaint Note</label>
            <textarea 
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="E.g., Patient complaining of severe headache since 2 days."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3087DF]/50 min-h-[80px]"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <button 
            onClick={handleSave}
            disabled={!patient || tags.length === 0}
            className="w-full bg-[#3087DF] disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            Save & Add to List
          </button>
        </div>

      </div>
    </div>
  );
}

function VideoCallView({ consultation, onEndCall }) {
  const doctor = DOCTORS.find(d => d.id === consultation.assignedDoctorId);

  return (
    <div className="mx-auto max-w-md bg-gray-900 min-h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent absolute top-0 w-full z-10">
        <span className="font-bold bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          04:32
        </span>
        <span className="text-xs font-semibold text-gray-300 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          End-to-end Encrypted
        </span>
      </div>

      {/* Main Video Area (Doctor) */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-800">
         <div className="text-center z-10">
            <div className="w-28 h-28 bg-gray-700 rounded-full mx-auto flex items-center justify-center text-4xl text-gray-300 font-bold mb-4 shadow-xl border-4 border-gray-600">
               {doctor?.name.charAt(4)}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{doctor?.name}</h2>
            <p className="text-[#3087DF] font-medium">{doctor?.spec}</p>
            <p className="text-gray-400 text-sm mt-2">{doctor?.hospital}</p>
         </div>

         {/* Background glow effect */}
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-800 opacity-80 pointer-events-none"></div>

         {/* Floating self-view (Patient) */}
         <div className="absolute bottom-6 right-4 w-28 h-40 bg-gray-700 rounded-xl border-2 border-gray-500 overflow-hidden flex items-center justify-center shadow-lg z-20">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 font-bold text-2xl mb-1">{consultation.patientName.charAt(0)}</span>
              <span className="text-[10px] text-gray-300 bg-black/50 px-2 py-0.5 rounded-full">You</span>
            </div>
         </div>
      </div>

      {/* Controls */}
      <div className="p-8 pb-12 bg-gray-900 flex justify-center gap-6 items-center z-20 border-t border-gray-800">
        <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-700 transition-colors">
          <Mic className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-700 transition-colors">
          <Video className="w-5 h-5" />
        </button>
        <button
          onClick={() => onEndCall(consultation.id)}
          className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-transform active:scale-95"
        >
          <PhoneOff className="w-7 h-7 text-white" />
        </button>
        <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-700 transition-colors">
          <Camera className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}