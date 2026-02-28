import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, HeartPulse, AlertTriangle, ChevronRight, 
  Baby, Activity, Calendar, FileText, CheckCircle2, Plus, Minus
} from 'lucide-react';

// --- Reusable UI Components ---

const Card = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-[16px] shadow-sm p-4 mb-4 ${className}`}>
    {title && <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">{title}</h3>}
    {children}
  </div>
);

const Label = ({ children }) => <label className="block text-sm font-medium text-gray-600 mb-2">{children}</label>;

const TextInput = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4">
    <Label>{label}</Label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-gray-50 border border-gray-200 rounded-[12px] px-4 py-3 text-base focus:ring-2 focus:ring-[#3087DF] focus:border-transparent outline-none transition-all"
    />
  </div>
);

const ToggleGroup = ({ label, options, selected, onChange }) => (
  <div className="mb-4">
    <Label>{label}</Label>
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-3 px-2 rounded-[12px] text-sm font-medium transition-colors ${
            selected === opt 
              ? 'bg-[#3087DF] text-white shadow-md' 
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const SliderInput = ({ label, value, onChange, min, max, unit, dangerThreshold }) => {
  const isDanger = dangerThreshold && dangerThreshold(value);
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <Label>{label}</Label>
        <span className={`font-bold text-lg ${isDanger ? 'text-red-500' : 'text-[#3087DF]'}`}>
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDanger ? 'bg-red-200 accent-red-500' : 'bg-blue-100 accent-[#3087DF]'}`}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

const Stepper = ({ label, value, onChange, min = 0 }) => (
  <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-[12px] border border-gray-200">
    <Label>{label}</Label>
    <div className="flex items-center gap-4">
      <button 
        onClick={() => value > min && onChange(value - 1)}
        className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-[#3087DF] active:scale-95"
      >
        <Minus size={20} />
      </button>
      <span className="text-xl font-bold w-6 text-center">{value}</span>
      <button 
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 rounded-full bg-[#3087DF] shadow-sm flex items-center justify-center text-white active:scale-95"
      >
        <Plus size={20} />
      </button>
    </div>
  </div>
);

const StickyBottomBar = ({ children }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
    <div className="max-w-md mx-auto">
      {children}
    </div>
  </div>
);

const PrimaryButton = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`w-full bg-[#3087DF] text-white font-semibold rounded-[16px] py-4 text-center active:scale-95 transition-transform flex items-center justify-center gap-2 text-lg shadow-md ${className}`}
  >
    {children}
  </button>
);

// --- Main Application ---

export default function AddFamily() {
  const [appState, setAppState] = useState('ADD_FAMILY'); // ADD_FAMILY, ADD_MEMBER, PREGNANCY_PROMPT, PREGNANCY_FORM, CHILD_FORM, OVERVIEW
  
  const [familyData, setFamilyData] = useState({
    village: '', headName: '', mobile: '', houseNumber: '',abhaID: '', members: []
  });

  const [currentMember, setCurrentMember] = useState(getInitialMemberState());
  const [pregnancyData, setPregnancyData] = useState(getInitialPregnancyState());
  const [childData, setChildData] = useState(getInitialChildState());

  function getInitialMemberState() {
    return {
      name: '', age: '', gender: 'Female', abhaId: '', weight: 60, height: 160, sysBP: 120, sugar: 100, temp: 98.6,
      symptoms: { persistentCough: 'No', chestPain: 'No', breathlessness: 'No', weightLoss: 'No', fever: 'No' },
      history: { diabetes: 'No', hypertension: 'No', tb: 'No' },
      missedFollowUps: 0
    };
  }

  function getInitialPregnancyState() {
    return {
      gravida: 1, para: 0, trimester: '1st', lmp: '',
      history: { cSection: false, miscarriage: false, stillbirth: false, htn: false, diabetes: false, anemia: false, thyroid: false, multiple: false, ageRisk: false },
      vitals: { sysBP: 120, diaBP: 80, sugar: 100, temp: 98.6, weight: 65, edema: 'No', urineProtein: 'Negative' },
      symptoms: { headache: false, blurredVision: false, abdPain: false, bleeding: false, breathlessness: false, reducedFetalMovement: false, fever: false, vomiting: false },
      compliance: { iron: 'Yes', calcium: 'Yes', ttDoses: 1, missedANC: 'No', missedFollowUps: 0 }
    };
  }

  function getInitialChildState() {
    return {
      growth: { weight: 12, height: 85, muac: 13.5, wasting: 'No' },
      vitals: { temp: 98.6, respRate: 30 },
      symptoms: { fever: 'No', cough: 'No', diarrhea: 'No', vomiting: 'No', refusalToFeed: 'No', lethargy: 'No', convulsions: 'No' },
      compliance: { fullyImmunized: 'Yes', missedVaccine: 'No', missedFollowUps: 0, recentHospital: 'No' }
    };
  }

  // --- Logic & Handlers ---

  const handleSaveFamily = () => {
    setAppState('ADD_MEMBER');
  };

  const handleSaveMember = () => {
    const age = parseInt(currentMember.age) || 0;
    if (currentMember.gender === 'Female' && age > 17) {
      setAppState('PREGNANCY_PROMPT');
    } else if (age <= 3) {
      setAppState('CHILD_FORM');
    } else {
      finalizeMember(currentMember);
    }
  };

  const finalizeMember = (memberData, extraData = {}, type = 'General') => {
    const bmi = (memberData.weight / Math.pow(memberData.height / 100, 2)).toFixed(1);
    const newMember = { ...memberData, bmi, ...extraData, type, id: Date.now() };
    
    // Auto Risk Calculation
    let risk = 'Green';
    if (memberData.sysBP > 140 || memberData.sugar > 140 || memberData.temp > 100) risk = 'Orange';
    if (type === 'Pregnancy' && (extraData.symptoms?.bleeding || extraData.symptoms?.reducedFetalMovement)) risk = 'Red';
    if (type === 'Child' && (extraData.symptoms?.convulsions === 'Yes' || extraData.growth?.muac < 11.5)) risk = 'Red';
    
    newMember.riskLevel = risk;

    setFamilyData(prev => ({ ...prev, members: [...prev.members, newMember] }));
    setCurrentMember(getInitialMemberState());
    setPregnancyData(getInitialPregnancyState());
    setChildData(getInitialChildState());
    setAppState('OVERVIEW');
  };

  const submitDataToSupabase = async () => {
    // --- NEW: Validation Check ---
    if (!familyData.headName || !familyData.village) {
      alert("Please complete the family details (Name and Village) before saving.");
      return; // Stops the function from proceeding
    }

    for (const member of familyData.members) {
      if (!member.name || !member.age) {
        alert("Error: One or more members are missing a Name or Age. Please fix this before completing registration.");
        return; // Stops the function from proceeding
      }
    }
    // -----------------------------
    try {
      // 1. Insert Family
      const { data: familyRes, error: familyErr } = await supabase
        .from('families')
        .insert([{
          village: familyData.village,
          head_name: familyData.headName,
          mobile: familyData.mobile,
          house_number: familyData.houseNumber,
          abha_id: familyData.abhaID
        }])
        .select()
        .single();

      if (familyErr) throw familyErr;
      const familyId = familyRes.id;

      // 2. Loop through members and insert them
      for (const member of familyData.members) {
        const { data: memberRes, error: memberErr } = await supabase
          .from('members')
          .insert([{
            family_id: familyId,
            name: member.name,
            age: parseInt(member.age),
            gender: member.gender,
            abha_id: member.abhaId,
            weight: member.weight,
            height: member.height,
            bmi: parseFloat(member.bmi) || null,
            sys_bp: member.sysBP,
            sugar: member.sugar,
            temp: member.temp,
            symptoms: member.symptoms,
            history: member.history,
            missed_follow_ups: member.missedFollowUps,
            type: member.type,
            risk_level: member.riskLevel
          }])
          .select()
          .single();

        if (memberErr) throw memberErr;
        const memberId = memberRes.id;

        // 3a. Insert Pregnancy Data if applicable
        if (member.type === 'Pregnancy') {
          // You saved pregnancy/child data into the member object in your finalizeMember function
          const { error: pregErr } = await supabase
            .from('pregnancies')
            .insert([{
              member_id: memberId,
              gravida: member.gravida,
              para: member.para,
              trimester: member.trimester,
              lmp: member.lmp || null,
              history: member.history,
              vitals: member.vitals,
              symptoms: member.symptoms,
              compliance: member.compliance
            }]);
          if (pregErr) throw pregErr;
        }

        // 3b. Insert Child Data if applicable
        if (member.type === 'Child') {
          const { error: childErr } = await supabase
            .from('children')
            .insert([{
              member_id: memberId,
              growth: member.growth,
              vitals: member.vitals,
              symptoms: member.symptoms,
              compliance: member.compliance
            }]);
          if (childErr) throw childErr;
        }
      }

      alert("Family Data Saved to Server successfully!");
      setFamilyData({ village: '', headName: '', mobile: '', houseNumber: '', members: [] });
      setAppState('ADD_FAMILY');

    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  // --- Views ---

  const renderAddFamily = () => (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-[#3087DF] text-white p-6 rounded-b-[24px] mb-6 shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users /> Add New Family</h1>
        <p className="text-blue-100 mt-1 opacity-90">Step 1 of Registration</p>
      </div>
      
      <div className="px-4">
        <Card>
          <TextInput label="Village / Location" value={familyData.village} onChange={(v) => setFamilyData({...familyData, village: v})} placeholder="Enter village name" />
          <TextInput label="Head of Family Name" value={familyData.headName} onChange={(v) => setFamilyData({...familyData, headName: v})} placeholder="Full name" />
          <TextInput label="Mobile Number" value={familyData.mobile} onChange={(v) => setFamilyData({...familyData, mobile: v})} type="tel" placeholder="10-digit mobile number" />
          <TextInput label="House Number" value={familyData.houseNumber} onChange={(v) => setFamilyData({...familyData, houseNumber: v})} placeholder="House/Ward number" />
        </Card>
      </div>

      <StickyBottomBar>
        <PrimaryButton onClick={handleSaveFamily}>Next <ChevronRight size={20}/></PrimaryButton>
      </StickyBottomBar>
    </div>
  );

  const renderAddMember = () => (
    <div className="pb-24 animate-in fade-in slide-in-from-right-4">
      <div className="bg-white p-4 sticky top-0 z-40 border-b border-gray-100 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#3087DF]">
          <UserPlus size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Add Member</h2>
          <p className="text-sm text-gray-500">{familyData.headName}'s Family</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card title="Basic Details">
          <TextInput label="Full Name" value={currentMember.name} onChange={(v) => setCurrentMember({...currentMember, name: v})} placeholder="Member's name" />
          <TextInput 
            label="ABHA ID (Optional)" 
            value={currentMember.abhaId} 
            onChange={(v) => setCurrentMember({...currentMember, abhaId: v})} 
            placeholder="14-digit ABHA number" 
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <TextInput label="Age (Years)" value={currentMember.age} onChange={(v) => setCurrentMember({...currentMember, age: v})} type="number" placeholder="e.g. 35" />
            </div>
            <div className="flex-1">
              <ToggleGroup label="Gender" options={['Male', 'Female', 'Other']} selected={currentMember.gender} onChange={(v) => setCurrentMember({...currentMember, gender: v})} />
            </div>
          </div>
        </Card>

        <Card title="Vitals & Measurements">
          <SliderInput label="Weight" value={currentMember.weight} onChange={(v) => setCurrentMember({...currentMember, weight: v})} min={0} max={150} unit="kg" />
          <SliderInput label="Height" value={currentMember.height} onChange={(v) => setCurrentMember({...currentMember, height: v})} min={50} max={220} unit="cm" />
          <div className="bg-blue-50 p-3 rounded-[12px] flex justify-between items-center mb-4 border border-blue-100">
            <span className="text-sm font-medium text-blue-800">Auto BMI Calculation</span>
            <span className="font-bold text-lg text-[#3087DF]">
              {currentMember.weight && currentMember.height ? (currentMember.weight / Math.pow(currentMember.height / 100, 2)).toFixed(1) : '--'}
            </span>
          </div>
          
          <SliderInput label="Systolic BP" value={currentMember.sysBP} onChange={(v) => setCurrentMember({...currentMember, sysBP: v})} min={70} max={200} unit="mmHg" dangerThreshold={(v) => v > 140 || v < 90} />
          <SliderInput label="Blood Sugar (RBS)" value={currentMember.sugar} onChange={(v) => setCurrentMember({...currentMember, sugar: v})} min={50} max={400} unit="mg/dL" dangerThreshold={(v) => v > 140} />
          <SliderInput label="Body Temp" value={currentMember.temp} onChange={(v) => setCurrentMember({...currentMember, temp: v})} min={95} max={106} unit="°F" dangerThreshold={(v) => v > 99.5} />
        </Card>

        <Card title="Symptoms & History">
          <div className="grid grid-cols-2 gap-3 mb-6">
             {Object.keys(currentMember.symptoms).map(sym => (
               <div key={sym} className="flex flex-col gap-1">
                 <Label>{sym.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                 <ToggleGroup options={['Yes', 'No']} selected={currentMember.symptoms[sym]} onChange={(v) => setCurrentMember({...currentMember, symptoms: {...currentMember.symptoms, [sym]: v}})} />
               </div>
             ))}
          </div>
          <div className="h-px bg-gray-100 w-full mb-4"></div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Known Conditions</h4>
          <div className="grid grid-cols-2 gap-3">
             {Object.keys(currentMember.history).map(hist => (
               <div key={hist} className="flex flex-col gap-1">
                 <Label>{hist.charAt(0).toUpperCase() + hist.slice(1)}</Label>
                 <ToggleGroup options={['Yes', 'No']} selected={currentMember.history[hist]} onChange={(v) => setCurrentMember({...currentMember, history: {...currentMember.history, [hist]: v}})} />
               </div>
             ))}
          </div>
        </Card>
        
        <Card>
          <Stepper label="Missed Follow-ups" value={currentMember.missedFollowUps} onChange={(v) => setCurrentMember({...currentMember, missedFollowUps: v})} />
        </Card>
      </div>

      <StickyBottomBar>
        <PrimaryButton onClick={handleSaveMember}>Save & Continue</PrimaryButton>
      </StickyBottomBar>
    </div>
  );

  const renderPregnancyPrompt = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#3087DF] mx-auto mb-4">
          <Baby size={32} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Is she pregnant?</h2>
        <p className="text-center text-gray-500 mb-8">{currentMember.name} is {currentMember.age} years old.</p>
        <div className="flex gap-4">
          <button onClick={() => finalizeMember(currentMember)} className="flex-1 py-4 rounded-[16px] border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 active:scale-95 transition-all">
            No
          </button>
          <button onClick={() => setAppState('PREGNANCY_FORM')} className="flex-1 py-4 rounded-[16px] bg-[#3087DF] text-white font-semibold shadow-md active:scale-95 transition-all">
            Yes
          </button>
        </div>
      </div>
    </div>
  );

  const renderPregnancyForm = () => {
    // Auto calculate EDD
    const calculateEDD = (lmpDate) => {
      if (!lmpDate) return '--';
      const date = new Date(lmpDate);
      date.setDate(date.getDate() + 280);
      return date.toLocaleDateString();
    };

    const isHighRisk = pregnancyData.symptoms.bleeding || pregnancyData.symptoms.reducedFetalMovement || pregnancyData.vitals.sysBP > 140;

    return (
      <div className="pb-24 animate-in slide-in-from-right-4">
        <div className="bg-white p-4 sticky top-0 z-40 border-b-4 border-[#3087DF] shadow-sm flex items-center gap-3">
          <Activity className="text-[#3087DF]" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Pregnancy Details</h2>
            <p className="text-sm text-gray-500">{currentMember.name} • {currentMember.age} yrs</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Card title="Obstetric History">
            <div className="flex gap-4">
              <div className="flex-1"><Stepper label="Gravida (G)" value={pregnancyData.gravida} onChange={(v) => setPregnancyData({...pregnancyData, gravida: v})} min={1} /></div>
              <div className="flex-1"><Stepper label="Para (P)" value={pregnancyData.para} onChange={(v) => setPregnancyData({...pregnancyData, para: v})} /></div>
            </div>
            <ToggleGroup label="Trimester" options={['1st', '2nd', '3rd']} selected={pregnancyData.trimester} onChange={(v) => setPregnancyData({...pregnancyData, trimester: v})} />
            <TextInput label="Last Menstrual Period (LMP)" type="date" value={pregnancyData.lmp} onChange={(v) => setPregnancyData({...pregnancyData, lmp: v})} />
            <div className="bg-blue-50 p-4 rounded-[12px] flex justify-between items-center border border-blue-100">
              <span className="text-sm font-medium flex items-center gap-2"><Calendar size={16}/> Auto EDD</span>
              <span className="font-bold text-[#3087DF]">{calculateEDD(pregnancyData.lmp)}</span>
            </div>
          </Card>

          <Card title="High Risk History (Select if Yes)">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {Object.keys(pregnancyData.history).map(key => (
                <label key={key} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <input type="checkbox" checked={pregnancyData.history[key]} onChange={(e) => setPregnancyData({...pregnancyData, history: {...pregnancyData.history, [key]: e.target.checked}})} className="w-5 h-5 rounded text-[#3087DF] focus:ring-[#3087DF]" />
                  <span className="text-sm text-gray-700 leading-tight">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Current Vitals">
            <SliderInput label="Systolic BP" value={pregnancyData.vitals.sysBP} onChange={(v) => setPregnancyData({...pregnancyData, vitals: {...pregnancyData.vitals, sysBP: v}})} min={70} max={200} unit="mmHg" dangerThreshold={(v) => v > 140} />
            <SliderInput label="Diastolic BP" value={pregnancyData.vitals.diaBP} onChange={(v) => setPregnancyData({...pregnancyData, vitals: {...pregnancyData.vitals, diaBP: v}})} min={40} max={130} unit="mmHg" dangerThreshold={(v) => v > 90} />
            <ToggleGroup label="Edema (Swelling)" options={['Yes', 'No']} selected={pregnancyData.vitals.edema} onChange={(v) => setPregnancyData({...pregnancyData, vitals: {...pregnancyData.vitals, edema: v}})} />
          </Card>

          <Card title="Danger Signs">
             <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {Object.keys(pregnancyData.symptoms).map(key => (
                <label key={key} className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${pregnancyData.symptoms[key] ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-transparent'}`}>
                  <input type="checkbox" checked={pregnancyData.symptoms[key]} onChange={(e) => setPregnancyData({...pregnancyData, symptoms: {...pregnancyData.symptoms, [key]: e.target.checked}})} className="w-5 h-5 rounded text-red-500 focus:ring-red-500" />
                  <span className={`text-sm leading-tight ${pregnancyData.symptoms[key] ? 'text-red-700 font-medium' : 'text-gray-700'}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </Card>

          <div className={`rounded-[16px] p-5 mb-4 border ${isHighRisk ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <h3 className={`font-bold text-lg mb-2 flex items-center gap-2 ${isHighRisk ? 'text-red-700' : 'text-green-700'}`}>
              {isHighRisk ? <AlertTriangle /> : <CheckCircle2 />}
              Auto Risk Output: {isHighRisk ? 'HIGH RISK' : 'NORMAL'}
            </h3>
            <p className={`text-sm ${isHighRisk ? 'text-red-600' : 'text-green-600'}`}>
              {isHighRisk ? 'Immediate referral recommended. Danger signs detected.' : 'Routine ANC follow-up required. Ensure iron/calcium adherence.'}
            </p>
          </div>
        </div>

        <StickyBottomBar>
          <PrimaryButton onClick={() => finalizeMember(currentMember, pregnancyData, 'Pregnancy')}>Save Pregnancy Record</PrimaryButton>
        </StickyBottomBar>
      </div>
    );
  };

  const renderChildForm = () => {
    const isMalnourished = childData.growth.muac < 11.5 || childData.growth.wasting === 'Yes';
    const isHighRisk = childData.symptoms.convulsions === 'Yes' || isMalnourished;

    return (
      <div className="pb-24 animate-in slide-in-from-right-4">
        <div className="bg-white p-4 sticky top-0 z-40 border-b-4 border-teal-400 shadow-sm flex items-center gap-3">
          <Baby className="text-teal-500" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Child Health Details</h2>
            <p className="text-sm text-gray-500">{currentMember.name} • {currentMember.age} yrs</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Card title="Growth Monitoring">
            <SliderInput label="Weight" value={childData.growth.weight} onChange={(v) => setChildData({...childData, growth: {...childData.growth, weight: v}})} min={1} max={30} unit="kg" />
            <SliderInput label="MUAC" value={childData.growth.muac} onChange={(v) => setChildData({...childData, growth: {...childData.growth, muac: v}})} min={8} max={20} unit="cm" dangerThreshold={(v) => v < 11.5} />
            <ToggleGroup label="Visible Severe Wasting" options={['Yes', 'No']} selected={childData.growth.wasting} onChange={(v) => setChildData({...childData, growth: {...childData.growth, wasting: v}})} />
          </Card>

          <Card title="Symptoms & Infection">
            <div className="space-y-4">
              {Object.keys(childData.symptoms).map(sym => (
                <div key={sym}>
                  <ToggleGroup 
                    label={sym.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                    options={['Yes', 'No']} 
                    selected={childData.symptoms[sym]} 
                    onChange={(v) => setChildData({...childData, symptoms: {...childData.symptoms, [sym]: v}})} 
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Immunization">
            <ToggleGroup label="Fully Immunized for Age?" options={['Yes', 'No']} selected={childData.compliance.fullyImmunized} onChange={(v) => setChildData({...childData, compliance: {...childData.compliance, fullyImmunized: v}})} />
          </Card>

          <div className={`rounded-[16px] p-5 mb-4 border ${isHighRisk ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
             <h3 className={`font-bold text-lg mb-2 flex items-center gap-2 ${isHighRisk ? 'text-red-700' : 'text-green-700'}`}>
              {isHighRisk ? <AlertTriangle /> : <CheckCircle2 />}
              {isHighRisk ? 'HIGH RISK DETECTED' : 'HEALTHY CHILD'}
            </h3>
            <ul className={`text-sm space-y-1 list-disc list-inside ${isHighRisk ? 'text-red-600' : 'text-green-600'}`}>
              <li>Malnutrition Risk: {isMalnourished ? 'Severe (SAM)' : 'Normal'}</li>
              <li>Referral: {isHighRisk ? 'Immediate PHC Referral' : 'Routine care'}</li>
            </ul>
          </div>
        </div>

        <StickyBottomBar>
          <PrimaryButton onClick={() => finalizeMember(currentMember, childData, 'Child')} className="bg-teal-500">Save Child Record</PrimaryButton>
        </StickyBottomBar>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="pb-32 animate-in fade-in">
      <div className="bg-[#3087DF] text-white p-6 rounded-b-[24px] mb-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Users size={120} />
        </div>
        <h1 className="text-2xl font-bold">{familyData.headName}'s Family</h1>
        <p className="text-blue-100 mt-1">{familyData.village} • House {familyData.houseNumber}</p>
        <div className="mt-4 bg-white/20 inline-block px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/30">
          {familyData.members.length} Members Registered
        </div>
      </div>

      <div className="px-4 space-y-3">
        {familyData.members.map((member, idx) => (
          <div key={idx} className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                member.type === 'Pregnancy' ? 'bg-pink-400' : 
                member.type === 'Child' ? 'bg-teal-400' : 'bg-gray-300'
              }`}>
                {member.type === 'Pregnancy' ? <HeartPulse size={24} /> : 
                 member.type === 'Child' ? <Baby size={24} /> : <Users size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.age} yrs • {member.gender}</p>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              member.riskLevel === 'Red' ? 'bg-red-100 text-red-600 border border-red-200' :
              member.riskLevel === 'Orange' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
              'bg-green-100 text-green-600 border border-green-200'
            }`}>
              {member.riskLevel}
            </div>
          </div>
        ))}

        <button 
          onClick={() => setAppState('ADD_MEMBER')}
          className="w-full mt-4 py-4 rounded-[16px] border-2 border-dashed border-[#3087DF] text-[#3087DF] font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
        >
          <UserPlus size={20} /> Add Another Member
        </button>
      </div>

      <StickyBottomBar>
        <PrimaryButton 
          onClick={submitDataToSupabase} 
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 size={20} /> Complete Registration
        </PrimaryButton>
      </StickyBottomBar>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-200">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative shadow-2xl overflow-x-hidden">
        {appState === 'ADD_FAMILY' && renderAddFamily()}
        {appState === 'ADD_MEMBER' && renderAddMember()}
        {appState === 'PREGNANCY_PROMPT' && renderPregnancyPrompt()}
        {appState === 'PREGNANCY_FORM' && renderPregnancyForm()}
        {appState === 'CHILD_FORM' && renderChildForm()}
        {appState === 'OVERVIEW' && renderOverview()}
      </div>
    </div>
  );
}