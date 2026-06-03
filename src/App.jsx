import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Wallet, TrendingUp, ChevronRight, 
  CheckCircle2, Clock, Info, X, FileText, AlertCircle,
  Heart, User, Home, ArrowLeft, Bookmark, Share2,
  FileCheck, Bot, Users, Activity, Target, ShieldCheck, Download
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OCCUPATIONS, MARITAL_STATUS, HOUSING_TYPES } from './constants/options';
import { SelectionCard } from './components/OnboardingComponents';
import { POLICIES } from './constants/policies';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const InputField = ({ label, icon: Icon, type = "text", ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      <Icon size={16} className="text-primary" />
      {label}
    </label>
    <input 
      type={type}
      {...props}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
    />
  </div>
);

const PolicyCard = ({ policy, onClick, isScrapped, onScrap, isHighlyRecommended }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className={cn(
      "relative bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col h-full",
      isHighlyRecommended ? "border-primary/50 shadow-primary/10" : "border-gray-100"
    )}
  >
    {isHighlyRecommended && (
      <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
        <Target size={12} /> 강력추천
      </div>
    )}
    <div className="flex justify-between items-start mb-4">
      <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full">
        {policy.category}
      </span>
      <div className="flex gap-2 items-center">
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded",
          policy.tag === "자격충족" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
        )}>
          {policy.tag}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onScrap(policy.id); }}
          className={cn(
            "p-1.5 rounded-full transition-all",
            isScrapped ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:text-red-400"
          )}
        >
          <Heart size={16} fill={isScrapped ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
    
    <div className="flex-1">
      <h3 className="text-lg font-bold mb-2 text-gray-900 leading-tight tracking-tight break-keep">{policy.title}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{policy.summary}</p>
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
      <div className="flex items-center gap-1 text-red-500 font-bold text-sm">
        <Clock size={14} />
        {policy.dDay}
      </div>
      <div className="text-primary text-sm font-semibold flex items-center gap-1">
        자세히 보기 <ChevronRight size={16} />
      </div>
    </div>
  </motion.div>
);

const FilterButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
      active ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
    )}
  >
    {label}
  </button>
);

// --- MODALS ---

const MentoringModal = ({ onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black flex items-center gap-2"><Users className="text-primary"/> 멘토링 신청</h2>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200"><X size={20} /></button>
      </div>
      <p className="text-gray-500 mb-8">어떤 방식의 멘토링을 원하시나요? 내게 맞는 방식을 선택해 전문가의 도움을 받아보세요.</p>
      <div className="space-y-4">
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-primary/20 hover:border-primary bg-blue-50/50 hover:bg-blue-50 transition-all text-left" onClick={() => { alert('AI 멘토링이 시작됩니다.'); onClose(); }}>
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center"><Bot size={24} /></div>
          <div><h3 className="font-bold text-gray-900 text-lg">AI 멘토링 시작하기</h3><p className="text-sm text-gray-500">24시간 언제나 즉각적인 답변과 서류 피드백</p></div>
        </button>
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-left" onClick={() => { alert('전문가 매칭이 신청되었습니다.'); onClose(); }}>
          <div className="w-12 h-12 bg-gray-800 text-white rounded-xl flex items-center justify-center"><User size={24} /></div>
          <div><h3 className="font-bold text-gray-900 text-lg">실무자 1:1 매칭 신청</h3><p className="text-sm text-gray-500">복잡한 케이스에 대한 심층 상담 (대기 발생 가능)</p></div>
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const MockApplyModal = ({ policy, onClose, setApplications }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 2000); }, []);

  const handleRealApply = () => {
    setApplications(prev => {
      if(prev.find(p => p.policyId === policy.id)) return prev;
      return [...prev, { policyId: policy.id, status: '접수완료', date: new Date().toISOString().split('T')[0] }];
    });
    alert('실제 신청이 접수되었습니다! 마이페이지에서 현황을 확인하세요.');
    onClose();
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <Activity size={48} className="text-primary animate-pulse mb-6" />
        <h2 className="text-white text-2xl font-black mb-2">모의 진단 중입니다...</h2>
        <p className="text-white/70">과거 합격 데이터와 님의 스펙을 대조하고 있어요</p>
      </motion.div>
    );
  }

  const isHighProb = policy.probability >= 80;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className={cn("p-8 text-center text-white", isHighProb ? "bg-primary" : "bg-orange-500")}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {isHighProb ? <Target size={40} /> : <AlertCircle size={40} />}
          </div>
          <h2 className="text-3xl font-black mb-2">{isHighProb ? "합격 안정권입니다!" : "조금 간당간당해요"}</h2>
          <p className="opacity-90">{policy.title} 모의 진단 결과</p>
        </div>
        <div className="p-8 space-y-6 bg-gray-50">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-sm text-gray-500 font-bold mb-1">나의 예상 합격률</p>
            <p className={cn("text-5xl font-black", isHighProb ? "text-primary" : "text-orange-500")}>{policy.probability}%</p>
          </div>
          
          {!isHighProb && (
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
              <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2"><ShieldCheck size={18}/> 리바운드 케어 (대체 정책)</h4>
              <p className="text-sm text-orange-700 mb-4">소득 조건에서 감점이 발생했습니다. 아래 정책은 어떠신가요?</p>
              <button className="w-full py-3 bg-white text-orange-600 font-bold rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors">청년 월세 한시 특별지원 알아보기</button>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 transition-colors">닫기</button>
            <button onClick={handleRealApply} className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-colors">실제 신청하기</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MainDetailModal = ({ policy, onClose, isScrapped, onScrap, onOpenMock, onOpenMentoring, issuedDocs, setIssuedDocs }) => {
  if (!policy) return null;
  
  const handleIssueAllDocs = () => {
    setIssuedDocs(prev => {
      const newDocs = new Set([...prev, ...policy.documents]);
      return Array.from(newDocs);
    });
    alert('필요한 서류가 모두 발급(연동)되어 서류함에 저장되었습니다.');
  };

  const handleE_Sign = () => {
    alert('전자서명 뷰어가 열렸습니다. (데모)');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="relative bg-primary p-8 flex-shrink-0">
          <div className="absolute top-6 right-6 flex gap-2">
            <button onClick={() => onScrap(policy.id)} className={cn("p-2.5 rounded-full transition-colors", isScrapped ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30")}>
              <Heart size={20} fill={isScrapped ? "white" : "none"} />
            </button>
            <button onClick={onClose} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="text-white mt-4">
            <span className="text-xs font-black bg-white/20 px-3 py-1.5 rounded-lg mb-3 inline-block tracking-widest">{policy.category}</span>
            <h2 className="text-3xl font-black leading-tight">{policy.title}</h2>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1 bg-gray-50/50">
          
          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 gap-4">
            <button onClick={onOpenMock} className="p-4 bg-white border border-primary/20 rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2 text-primary">
              <Activity className="group-hover:scale-110 transition-transform" />
              <span className="font-bold">모의 진단 및 리바운드</span>
            </button>
            <button onClick={onOpenMentoring} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-gray-400 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2 text-gray-700">
              <Users className="group-hover:scale-110 transition-transform" />
              <span className="font-bold">무료 멘토링 신청</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">지원 혜택</h4>
            <p className="text-2xl font-black text-gray-900">{policy.benefit}</p>
          </div>

          {/* Stats & Community */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><TrendingUp size={16}/> 또래 신청 통계 및 예측</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 font-bold mb-1">최근 7일 신청자</p>
                <p className="text-xl font-black text-gray-900">{policy.applicants.toLocaleString()}명</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 font-bold mb-1">예상 커트라인 (소득)</p>
                <p className="text-xl font-black text-gray-900">상위 {(policy.probability - 10).toFixed(0)}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1"><Info size={12}/> 실제 합격자들의 가점 평균은 15점 내외입니다.</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">상세 자격 조건</h4>
            <p className="text-gray-700 leading-relaxed bg-white p-6 rounded-2xl border border-gray-100">{policy.details}</p>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2"><FileCheck size={18} className="text-primary" />구비 서류 원클릭 발급</h4>
              <button onClick={handleIssueAllDocs} className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 flex items-center gap-1">
                <Download size={14}/> 일괄 발급 연동
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {policy.documents.map((doc, i) => {
                const isIssued = issuedDocs.includes(doc);
                return (
                  <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-50">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <div className={cn("w-5 h-5 rounded-md flex items-center justify-center border", isIssued ? "bg-primary border-primary text-white" : "border-gray-300 text-transparent")}>
                        <CheckCircle2 size={14} className="currentColor" />
                      </div>
                      {doc}
                    </div>
                    {isIssued ? (
                      <span className="text-xs font-bold text-primary">준비완료</span>
                    ) : (
                      <span className="text-xs text-gray-400">미발급</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={handleE_Sign} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors">전자서명 열람</button>
          <button onClick={onOpenMock} className="flex-[2] py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-colors shadow-lg">신청 단계로 이동</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [step, setStep] = useState('auth'); 
  const [view, setView] = useState('main'); 
  const [onboardingSubStep, setOnboardingSubStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ 
    name: '', email: '', birthdate: '', occupation: '', maritalStatus: '', 
    region: '', income: '', assets: '', housingType: '', homelessPeriod: '' 
  });
  
  // Data States
  const [savedPolicyIds, setSavedPolicyIds] = useState([]);
  const [issuedDocs, setIssuedDocs] = useState([]);
  const [applications, setApplications] = useState([]); // { policyId, status, date }

  // Modal States
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showMockApply, setShowMockApply] = useState(false);
  const [showMentoring, setShowMentoring] = useState(false);

  // Filters
  const [filter, setFilter] = useState('전체');
  const [specialFilter, setSpecialFilter] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('nest-user');
      const savedScraps = localStorage.getItem('nest-scraps');
      const savedDocs = localStorage.getItem('nest-docs');
      const savedApps = localStorage.getItem('nest-apps');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.name) {
          setUser(parsedUser);
          setIsLoggedIn(true);
          setStep('dashboard');
        }
      }
      if (savedScraps) setSavedPolicyIds(JSON.parse(savedScraps));
      if (savedDocs) setIssuedDocs(JSON.parse(savedDocs));
      if (savedApps) setApplications(JSON.parse(savedApps));
    } catch (error) { 
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    if(isLoggedIn) {
      localStorage.setItem('nest-scraps', JSON.stringify(savedPolicyIds));
      localStorage.setItem('nest-docs', JSON.stringify(issuedDocs));
      localStorage.setItem('nest-apps', JSON.stringify(applications));
    }
  }, [savedPolicyIds, issuedDocs, applications, isLoggedIn]);

  const processedPolicies = useMemo(() => {
    const userIncome = parseInt(user.income) || 0;
    const userRegion = user.region || '';
    const userOccupation = user.occupation || '';

    return POLICIES.map(p => {
      let matchScore = 0;
      let tag = "확인필요";

      const isIncomeMatch = userIncome >= p.minIncome && userIncome <= p.maxIncome;
      if (isIncomeMatch) matchScore += 40;

      const isRegionMatch = p.regions.includes("전국") || userRegion.includes(p.regions[0]);
      if (isRegionMatch) matchScore += 30;

      const isOccupationMatch = p.occupations.includes(userOccupation);
      if (isOccupationMatch) matchScore += 30;

      if (isIncomeMatch && isRegionMatch && isOccupationMatch) tag = "자격충족";
      else if (isIncomeMatch || isRegionMatch) tag = "확인필요";
      else tag = "부적격";

      matchScore += (p.views / 10000) * 5 + (p.applicants / 10000) * 5;

      return { ...p, matchScore: Math.round(matchScore), tag };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [user]);

  const filteredPolicies = useMemo(() => {
    let list = processedPolicies.filter(p => p.tag !== "부적격");
    if (filter !== '전체') list = list.filter(p => p.category === filter);
    if (specialFilter === '자격충족') list = list.filter(p => p.tag === '자격충족');
    else if (specialFilter === '마감임박') list = list.filter(p => p.dDay.includes('D-') && parseInt(p.dDay.replace('D-', '')) <= 7);
    return list;
  }, [processedPolicies, filter, specialFilter]);

  const totalBenefitAmount = useMemo(() => {
    return processedPolicies.filter(p => p.tag === "자격충족").reduce((acc, curr) => acc + curr.benefitAmount, 0);
  }, [processedPolicies]);

  const savedPolicies = useMemo(() => processedPolicies.filter(p => savedPolicyIds.includes(p.id)), [processedPolicies, savedPolicyIds]);
  const appliedPolicies = useMemo(() => applications.map(app => {
    const p = processedPolicies.find(po => po.id === app.policyId);
    return { ...p, appStatus: app.status, applyDate: app.date };
  }).filter(p => p.id), [applications, processedPolicies]);

  const trendingPolicies = [...processedPolicies].sort((a, b) => b.views - a.views).slice(0, 3);

  // Handlers
  const handleLogin = (e) => { e.preventDefault(); setIsLoggedIn(true); setStep('onboarding'); };
  const handleNextSubStep = (e) => { e.preventDefault(); setOnboardingSubStep(prev => prev + 1); };
  const handlePrevSubStep = () => setOnboardingSubStep(prev => prev - 1);
  const handleStart = (e) => {
    e.preventDefault();
    localStorage.setItem('nest-user', JSON.stringify(user));
    setStep('loading');
    setTimeout(() => setStep('dashboard'), 2500);
  };
  const handleUpdateProfile = (e) => { e.preventDefault(); localStorage.setItem('nest-user', JSON.stringify(user)); setIsEditingProfile(false); };
  const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); setStep('auth'); setOnboardingSubStep(1); setView('main'); setSavedPolicyIds([]); setIssuedDocs([]); setApplications([]); };
  const toggleScrap = (id) => setSavedPolicyIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-secondary-bg text-gray-900 font-sans">
      <AnimatePresence mode="wait">
        
        {/* --- AUTH --- */}
        {step === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <div className="text-center mb-10"><div className="text-4xl mb-4">🐥</div><h1 className="text-3xl font-black text-gray-900 mb-2">둥지탈출</h1><p className="text-gray-500 font-medium">초개인화 주거 정책 원스톱 매칭 서비스</p></div>
              <form onSubmit={handleLogin} className="space-y-6">
                <InputField label="이름(닉네임)" icon={CheckCircle2} placeholder="홍길동" required value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                <InputField label="이메일" icon={FileText} placeholder="example@email.com" type="email" required value={user.email} onChange={e => setUser({...user, email: e.target.value})} />
                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all text-lg">간편 1초 시작하기</button>
              </form>
            </div>
          </motion.div>
        )}

        {/* --- ONBOARDING --- */}
        {step === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <div className="flex gap-2 mb-8">{[1, 2, 3].map(i => (<div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", onboardingSubStep >= i ? "bg-primary" : "bg-gray-100")} />))}</div>
              <div className="text-center mb-8"><h1 className="text-2xl font-black text-gray-900 mb-2">{onboardingSubStep === 1 ? "기본 정보 입력" : onboardingSubStep === 2 ? "경제 활동 정보" : "주거 현황 정보"}</h1><p className="text-gray-500 font-medium text-sm">한 번의 입력으로 수백 개의 정책을 자동 진단합니다.</p></div>
              <form onSubmit={onboardingSubStep === 3 ? handleStart : handleNextSubStep} className="space-y-6">
                {onboardingSubStep === 1 && (
                  <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <InputField label="생년월일" icon={Clock} type="date" required value={user.birthdate} onChange={e => setUser({...user, birthdate: e.target.value})} />
                    <div className="space-y-2"><label className="text-sm font-medium text-gray-700 flex items-center gap-2"><TrendingUp size={16} className="text-primary" />직업 상태</label><div className="grid grid-cols-2 gap-2">{OCCUPATIONS.map(occ => (<SelectionCard key={occ} label={occ} selected={user.occupation === occ} onClick={() => setUser({...user, occupation: occ})} />))}</div></div>
                    <div className="space-y-2"><label className="text-sm font-medium text-gray-700 flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" />혼인 여부</label><div className="grid grid-cols-3 gap-2">{MARITAL_STATUS.map(ms => (<SelectionCard key={ms} label={ms} selected={user.maritalStatus === ms} onClick={() => setUser({...user, maritalStatus: ms})} />))}</div></div>
                  </motion.div>
                )}
                {onboardingSubStep === 2 && (
                  <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <InputField label="작년 기준 연소득" icon={Wallet} placeholder="단위: 만원 (예: 3200)" type="number" required value={user.income} onChange={e => setUser({...user, income: e.target.value})} />
                    <InputField label="보유 자산 규모" icon={TrendingUp} placeholder="예: 5000" type="number" required value={user.assets} onChange={e => setUser({...user, assets: e.target.value})} />
                  </motion.div>
                )}
                {onboardingSubStep === 3 && (
                  <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <InputField label="거주 희망 지역" icon={MapPin} placeholder="예: 서울" required value={user.region} onChange={e => setUser({...user, region: e.target.value})} />
                    <div className="space-y-2"><label className="text-sm font-medium text-gray-700 flex items-center gap-2"><MapPin size={16} className="text-primary" />현재 주거 형태</label><div className="grid grid-cols-2 gap-2">{HOUSING_TYPES.map(ht => (<SelectionCard key={ht} label={ht} selected={user.housingType === ht} onClick={() => setUser({...user, housingType: ht})} />))}</div></div>
                    <InputField label="무주택 기간" icon={Clock} placeholder="예: 3" type="number" required value={user.homelessPeriod} onChange={e => setUser({...user, homelessPeriod: e.target.value})} />
                  </motion.div>
                )}
                <div className="flex gap-3">
                  {onboardingSubStep > 1 && (<button type="button" onClick={handlePrevSubStep} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all text-lg">이전</button>)}
                  <button type="submit" className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all text-lg">
                    {onboardingSubStep === 3 ? "진단 시작하기" : "다음 단계"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* --- LOADING --- */}
        {step === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
            <div className="space-y-2"><h2 className="text-2xl font-black text-gray-900">{user.name}님의 프로필 분석 및 매칭 중...</h2><p className="text-gray-500 font-medium">전국 300여 개의 주거 정책 알고리즘을 분석하고 있습니다.</p></div>
          </motion.div>
        )}

        {/* --- DASHBOARD & MYPAGE --- */}
        {step === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
            
            {/* Navigation Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="text-primary font-black text-2xl cursor-pointer tracking-tight" onClick={() => setView('main')}>둥지탈출</div>
                <nav className="hidden md:flex items-center gap-8">
                  <button onClick={() => setView('main')} className={cn("text-sm font-bold transition-colors", view === 'main' ? "text-primary" : "text-gray-400 hover:text-gray-600")}>추천 홈</button>
                  <button onClick={() => setView('mypage')} className={cn("text-sm font-bold transition-colors", view === 'mypage' ? "text-primary" : "text-gray-400 hover:text-gray-600")}>마이페이지</button>
                </nav>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setView('mypage')} 
                    className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-lg font-black hover:bg-primary hover:text-white transition-all shadow-sm"
                    title="마이페이지로 이동"
                  >
                    {user.name.substring(0, 1)}
                  </button>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-10">
              {view === 'main' ? (
                /* --- MAIN HOME VIEW --- */
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-12"><h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight"><span className="text-primary">{user.name}님</span>을 위한<br />맞춤 주거 정책 진단 결과입니다 🏠</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 flex flex-col justify-center">
                        <p className="text-white/80 font-bold mb-1">최대 예상 혜택 가치</p>
                        <h2 className="text-4xl font-black">{totalBenefitAmount.toLocaleString()}만원</h2>
                      </div>
                      <motion.div whileHover={{ y: -5 }} onClick={() => {setSpecialFilter('자격충족'); setFilter('전체');}} className={cn("p-8 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-5", specialFilter === '자격충족' ? "bg-green-500 border-green-500 text-white shadow-lg" : "bg-white border-gray-100")}>
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", specialFilter === '자격충족' ? "bg-white/20 text-white" : "bg-green-50 text-green-500")}><CheckCircle2 size={28} /></div>
                        <div><p className="text-sm font-bold uppercase tracking-wider opacity-80">충족 정책</p><h3 className="text-3xl font-black">{processedPolicies.filter(p => p.tag === '자격충족').length}건</h3></div>
                      </motion.div>
                      <motion.div whileHover={{ y: -5 }} onClick={() => {setSpecialFilter('마감임박'); setFilter('전체');}} className={cn("p-8 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-5", specialFilter === '마감임박' ? "bg-orange-500 border-orange-500 text-white shadow-lg" : "bg-white border-gray-100")}>
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", specialFilter === '마감임박' ? "bg-white/20 text-white" : "bg-orange-50 text-orange-500")}><AlertCircle size={28} /></div>
                        <div><p className="text-sm font-bold uppercase tracking-wider opacity-80">마감 임박</p><h3 className="text-3xl font-black">{processedPolicies.filter(p => p.dDay.includes('D-') && parseInt(p.dDay.replace('D-', '')) <= 7).length}건</h3></div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black text-gray-900">
                            {specialFilter ? (specialFilter === '자격충족' ? '✅ 충족 정책' : '⏰ 마감 임박') : `🔥 ${user.name}님 추천 리스트`}
                          </h2>
                          {specialFilter && <button onClick={() => setSpecialFilter(null)} className="text-sm text-gray-400 hover:text-primary font-bold bg-gray-100 px-3 py-1 rounded-full">필터 해제</button>}
                        </div>
                        <div className="flex flex-wrap gap-2">{['전체', '대출지원', '월세지원', '공공임대', '자산형성'].map(cat => (<FilterButton key={cat} label={cat} active={filter === cat} onClick={() => setFilter(cat)} />))}</div>
                      </div>
                      
                      {/* Grid for Policy Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {filteredPolicies.map((policy, index) => (
                          <PolicyCard 
                            key={policy.id} 
                            policy={policy} 
                            onClick={() => setSelectedPolicy(policy)} 
                            isScrapped={savedPolicyIds.includes(policy.id)}
                            onScrap={toggleScrap}
                            isHighlyRecommended={index < 2 && specialFilter === null && filter === '전체'}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Right Sidebar */}
                    <aside className="lg:w-80 space-y-6">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-primary" />실시간 인기 랭킹</h2>
                        <div className="space-y-4">{trendingPolicies.map((p, i) => (
                          <div key={p.id} onClick={() => setSelectedPolicy(p)} className="flex items-center gap-4 cursor-pointer p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                            <div className={cn("w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-lg font-black", i === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-500")}>{i+1}</div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm text-gray-900 truncate">{p.title}</h3>
                              <p className="text-xs text-gray-400 font-medium">조회수 {(p.views/1000).toFixed(1)}k</p>
                            </div>
                          </div>
                        ))}</div>
                      </div>
                      
                      <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                        <div className="relative z-10">
                          <h3 className="text-xl font-black mb-2">무엇이든 물어보세요</h3>
                          <p className="text-blue-100 text-sm mb-6 leading-relaxed">정책 전문가와 AI 멘토가 복잡한 서류와 절차를 도와드립니다.</p>
                          <button onClick={() => setShowMentoring(true)} className="w-full py-3 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 transition-colors shadow-md">멘토링 신청하기</button>
                        </div>
                        <Bot size={120} className="absolute -bottom-10 -right-10 text-white/10" />
                      </div>
                    </aside>
                  </div>
                </motion.div>
              ) : (
                /* --- MY PAGE VIEW --- */
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h1 className="text-4xl font-black">마이페이지 총괄 보드</h1>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: User Info */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-primary/10"></div>
                        <div className="relative z-10 flex flex-col items-center text-center mt-6 mb-8">
                          <div className="w-24 h-24 bg-white border-4 border-white shadow-lg text-primary rounded-full flex items-center justify-center text-4xl font-black mb-4 relative">
                            {user.name.substring(0, 1)}
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <h2 className="text-2xl font-black">{user.name}님</h2>
                          <p className="text-gray-500 font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-gray-50">
                          <div className="flex justify-between items-center"><span className="text-sm text-gray-500">직업</span><span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">{user.occupation}</span></div>
                          <div className="flex justify-between items-center"><span className="text-sm text-gray-500">거주지</span><span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">{user.region}</span></div>
                          <div className="flex justify-between items-center"><span className="text-sm text-gray-500">연소득</span><span className="font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">{parseInt(user.income).toLocaleString()}만원</span></div>
                        </div>
                        <button onClick={() => setIsEditingProfile(true)} className="w-full mt-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">회원 정보 수정</button>
                        <button onClick={handleLogout} className="w-full mt-3 py-3 text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-all">로그아웃</button>
                      </div>

                      {/* Estimate Box */}
                      <div className="bg-gradient-to-br from-primary to-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/30">
                        <p className="text-white/80 font-bold text-sm mb-2">나의 확보 예상 가치</p>
                        <h3 className="text-3xl font-black">{totalBenefitAmount.toLocaleString()}만원</h3>
                      </div>
                    </div>

                    {/* Right Column: Tracker, Docs, Portfolio */}
                    <div className="lg:col-span-3 space-y-8">
                      
                      {/* Application Tracker (이력 보드) */}
                      <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Activity className="text-primary"/> 실시간 심사 현황 트래커 (포트폴리오)</h2>
                        {appliedPolicies.length > 0 ? (
                          <div className="space-y-4">
                            {appliedPolicies.map((app, i) => (
                              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                                <div>
                                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded mb-2 inline-block">{app.category}</span>
                                  <h3 className="font-bold text-lg text-gray-900">{app.title}</h3>
                                  <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14}/> 신청일: {app.applyDate}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 font-black text-gray-700 shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                    {app.appStatus}
                                  </div>
                                  <button className="text-sm text-primary font-bold hover:underline">상세보기</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                            <p className="text-gray-500 font-medium mb-4">아직 신청한 정책이 없습니다.<br/>모의 진단을 통해 첫 정책을 신청해보세요!</p>
                            <button onClick={() => setView('main')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110">추천 리스트 보기</button>
                          </div>
                        )}
                      </section>

                      {/* Documents Board */}
                      <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><FileCheck className="text-green-500"/> 내 서류 보관함</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {issuedDocs.length > 0 ? issuedDocs.map((doc, i) => (
                            <div key={i} className="p-4 bg-green-50 border border-green-100 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                              <FileText size={24} className="text-green-600" />
                              <span className="text-sm font-bold text-green-900">{doc}</span>
                            </div>
                          )) : (
                            <div className="col-span-full p-8 text-center text-gray-400 font-medium">발급된 서류가 없습니다. 정책 상세 페이지에서 연동하세요.</div>
                          )}
                        </div>
                      </section>

                      {/* Saved Policies (Scraps) */}
                      <section>
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Heart fill="currentColor" className="text-red-500"/> 관심 정책 ({savedPolicies.length})</h2>
                        {savedPolicies.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {savedPolicies.map(policy => (
                              <PolicyCard key={policy.id} policy={policy} onClick={() => setSelectedPolicy(policy)} isScrapped={true} onScrap={toggleScrap} />
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                            <Bookmark size={40} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 font-medium">관심 정책을 스크랩하여 비교해보세요!</p>
                          </div>
                        )}
                      </section>

                    </div>
                  </div>
                </motion.div>
              )}
            </main>

            {/* Profile Edit Modal */}
            <AnimatePresence>
              {isEditingProfile && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)}>
                  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black">회원 정보 수정</h2><button onClick={() => setIsEditingProfile(false)} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20} /></button></div>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      <InputField label="이름" icon={CheckCircle2} value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                      <InputField label="작년 연소득" icon={Wallet} type="number" value={user.income} onChange={e => setUser({...user, income: e.target.value})} />
                      <InputField label="보유 자산" icon={TrendingUp} type="number" value={user.assets} onChange={e => setUser({...user, assets: e.target.value})} />
                      <InputField label="거주 지역" icon={MapPin} value={user.region} onChange={e => setUser({...user, region: e.target.value})} />
                      <div className="space-y-2"><label className="text-sm font-medium text-gray-700">직업 상태</label>
                        <div className="grid grid-cols-2 gap-2">{OCCUPATIONS.map(occ => (<SelectionCard key={occ} label={occ} selected={user.occupation === occ} onClick={() => setUser({...user, occupation: occ})} />))}</div>
                      </div>
                      <button type="submit" className="w-full mt-6 py-4 bg-primary text-white font-bold rounded-2xl hover:brightness-110 transition-all text-lg shadow-lg">수정 완료</button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Global Modals */}
      <AnimatePresence>
        {selectedPolicy && (
          <MainDetailModal 
            policy={selectedPolicy} 
            onClose={() => setSelectedPolicy(null)} 
            isScrapped={savedPolicyIds.includes(selectedPolicy.id)}
            onScrap={toggleScrap}
            onOpenMock={() => setShowMockApply(true)}
            onOpenMentoring={() => setShowMentoring(true)}
            issuedDocs={issuedDocs}
            setIssuedDocs={setIssuedDocs}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMentoring && <MentoringModal onClose={() => setShowMentoring(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showMockApply && selectedPolicy && (
          <MockApplyModal policy={selectedPolicy} onClose={() => setShowMockApply(false)} setApplications={setApplications} />
        )}
      </AnimatePresence>

    </div>
  );
}
