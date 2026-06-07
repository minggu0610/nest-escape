import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Wallet, TrendingUp, 
  CheckCircle2, Clock, FileText, 
  Bot, Activity, BarChart3, FileCheck, Heart, X
} from 'lucide-react';
import { OCCUPATIONS, MARITAL_STATUS, HOUSING_TYPES } from './constants/options';
import { SelectionCard } from './components/OnboardingComponents';
import { POLICIES as MOCK_POLICIES } from './constants/policies';
import { cn } from './utils/cn';

// Components
import { InputField } from './components/common/InputField';
import { FilterButton } from './components/common/FilterButton';
import { PolicyCard } from './components/policy/PolicyCard';

// Modals
import { AIChatbotModal } from './components/modals/AIChatbotModal';
import { MentoringModal } from './components/modals/MentoringModal';
import { MockApplyModal } from './components/modals/MockApplyModal';
import { EmailAlertModal } from './components/modals/EmailAlertModal';
import { MainDetailModal } from './components/modals/MainDetailModal';

export default function App() {
  const [step, setStep] = useState('auth'); 
  const [view, setView] = useState('main'); 
  const [onboardingSubStep, setOnboardingSubStep] = useState(1);
  const [user, setUser] = useState({ 
    name: '', email: '', birthdate: '', occupation: '', maritalStatus: '', 
    region: '', income: '', assets: '', housingType: '', homelessPeriod: '' 
  });
  
  const [savedPolicyIds, setSavedPolicyIds] = useState([]);
  const [issuedDocs, setIssuedDocs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showMockApply, setShowMockApply] = useState(false);
  const [showMentoring, setShowMentoring] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  const [filter, setFilter] = useState('전체');
  const [specialFilter, setSpecialFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  
  const [policiesData, setPoliciesData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://nest-escape-api.user.workers.dev';
        
        // Fetch Mock Policies
        const mockRes = await fetch(`${API_BASE}/api/policies`);
        const mockJson = await mockRes.json();
        let combinedData = mockJson.success ? mockJson.data : MOCK_POLICIES;

        // Fetch LH Notices (03: 분양, 06: 임대, 31: 전세임대)
        try {
          const lhRes = await fetch(`${API_BASE}/api/lh-notices?UPP_AIS_TP_CD=03,06,31&PG_SZ=10`);
          const lhJson = await lhRes.json();
          if (lhJson.success && Array.isArray(lhJson.data)) {
            let allLH = [];
            lhJson.data.forEach(group => {
              if (group.data && group.data[1]?.dsList) {
                const mappedLH = group.data[1].dsList.map(item => {
                  let category = "공공임대";
                  if (group.code === '03') category = "공공분양";
                  if (group.code === '31') category = "전세임대";

                  return {
                    id: item.PAN_ID,
                    title: item.PAN_NM,
                    category: category,
                    tag: item.PAN_SS === "공고중" ? "자격충족" : "확인필요",
                    summary: item.AIS_TP_CD_NM,
                    dDay: item.CLSG_DT ? `D-${Math.ceil((new Date(item.CLSG_DT.replace(/\./g, '-')) - new Date()) / (1000 * 60 * 60 * 24))}` : '상시',
                    benefit: category === "공공분양" ? "내 집 마련 기회" : "시세 대비 저렴한 임대료",
                    benefitAmount: category === "공공분양" ? 5000 : 2000, 
                    probability: category === "공공분양" ? 40 : 65,
                    details: `${item.CNP_CD_NM} 지역의 ${item.AIS_TP_CD_NM} 공고입니다. 상세 내용은 LH 청약플러스에서 확인하세요.`,
                    documents: ["주민등록등본", "가족관계증명서", "소득금액증명원"],
                    views: Math.floor(Math.random() * 5000),
                    applicants: Math.floor(Math.random() * 1000),
                    minIncome: 0,
                    maxIncome: category === "공공분양" ? 8000 : 4500,
                    regions: [item.CNP_CD_NM],
                    occupations: ["대학생", "취업준비생", "직장인", "청년"],
                    originalUrl: item.DTL_URL
                  };
                });
                allLH = [...allLH, ...mappedLH];
              }
            });
            combinedData = [...combinedData, ...allLH];
          }
        } catch (lhErr) {
          console.error("LH API fetch error:", lhErr);
        }

        setPoliciesData(combinedData);
      } catch (err) {
        console.error("API fetch error:", err);
        setPoliciesData(MOCK_POLICIES);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('nest-search-history');
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('nest-search-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const processedPolicies = useMemo(() => {
    const userIncome = parseInt(user.income) || 0;
    const userRegion = user.region || '';
    const userOccupation = user.occupation || '';
    const userBirthYear = user.birthdate ? new Date(user.birthdate).getFullYear() : 1995;
    const userAgeGroup = Math.floor((2026 - userBirthYear) / 5) * 5; // e.g., 20, 25, 30

    const baseData = policiesData.length > 0 ? policiesData : MOCK_POLICIES;

    return baseData.map(p => {
      let score = 0;
      let tag = "확인필요";
      
      // 1. Basic Criteria (100 points max)
      const incMatch = userIncome >= p.minIncome && userIncome <= p.maxIncome;
      const regMatch = p.regions.includes("전국") || userRegion.includes(p.regions[0]) || (p.regions[0] && userRegion.includes(p.regions[0].substring(0, 2)));
      const occMatch = p.occupations.includes(userOccupation);
      
      if (incMatch) score += 40;
      if (regMatch) score += 30;
      if (occMatch) score += 30;

      // 2. Peer Popularity (Bonus up to 10 points)
      // Logic: If policy occupations/regions match common patterns for the age group
      const isPeerPopular = (userAgeGroup <= 25 && p.occupations.includes("대학생")) || 
                            (userAgeGroup > 25 && p.occupations.includes("직장인"));
      if (isPeerPopular) score += 10;

      // 3. Search History Match (Bonus up to 15 points)
      const matchesSearchHistory = searchHistory.some(keyword => p.title.includes(keyword) || p.summary.includes(keyword));
      if (matchesSearchHistory) score += 15;

      // 4. Current Search Match (Huge boost for real-time filtering)
      const matchesCurrentSearch = searchQuery && (p.title.includes(searchQuery) || p.summary.includes(searchQuery));

      if (incMatch && regMatch && occMatch) tag = "자격충족";
      else if (incMatch || regMatch) tag = "확인필요";
      else tag = "부적격";

      // Final Score Calculation
      score += (p.views / 10000) * 5;

      return { ...p, matchScore: Math.round(score), tag, 
        isPeerPopular,
        matchesCurrentSearch,
        why: [
          incMatch ? "소득 충족" : "소득 초과",
          regMatch ? "거주지 일치" : "거주지 다름",
          occMatch ? "직업 일치" : "직업 미달"
        ]
      };
    }).sort((a, b) => {
      if (searchQuery) {
        if (a.matchesCurrentSearch && !b.matchesCurrentSearch) return -1;
        if (!a.matchesCurrentSearch && b.matchesCurrentSearch) return 1;
      }
      return b.matchScore - a.matchScore;
    });
  }, [user, policiesData, searchHistory, searchQuery]);

  const filteredPolicies = useMemo(() => {
    let list = processedPolicies.filter(p => p.tag !== "부적격");
    if (filter !== '전체') list = list.filter(p => p.category === filter);
    if (specialFilter === '자격충족') list = list.filter(p => p.tag === '자격충족');
    else if (specialFilter === '마감임박') list = list.filter(p => p.dDay.includes('D-') && parseInt(p.dDay.replace('D-', '')) <= 7);
    
    if (searchQuery) {
      list = list.filter(p => p.title.includes(searchQuery) || p.summary.includes(searchQuery) || p.category.includes(searchQuery));
    }
    return list;
  }, [processedPolicies, filter, specialFilter, searchQuery]);

  const reportScore = useMemo(() => {
    const topPolicies = processedPolicies.slice(0, 3);
    if (topPolicies.length === 0) return 0;
    const avg = topPolicies.reduce((acc, p) => acc + p.matchScore, 0) / topPolicies.length;
    return Math.min(Math.round(avg), 100);
  }, [processedPolicies]);

  const totalBenefitAmount = useMemo(() => processedPolicies.filter(p => p.tag === "자격충족").reduce((acc, curr) => acc + curr.benefitAmount, 0), [processedPolicies]);
  const appliedPolicies = useMemo(() => applications.map(app => ({...processedPolicies.find(po => po.id === app.policyId), appStatus: app.status, applyDate: app.date})).filter(p => p.id), [applications, processedPolicies]);
  const savedPolicies = useMemo(() => processedPolicies.filter(p => savedPolicyIds.includes(p.id)), [processedPolicies, savedPolicyIds]);

  useEffect(() => {
    if(step !== 'auth') {
      localStorage.setItem('nest-scraps', JSON.stringify(savedPolicyIds));
      localStorage.setItem('nest-docs', JSON.stringify(issuedDocs));
      localStorage.setItem('nest-apps', JSON.stringify(applications));
    }
  }, [savedPolicyIds, issuedDocs, applications, step]);

  // Handlers
  const handleStart = (e) => { e.preventDefault(); localStorage.setItem('nest-user', JSON.stringify(user)); setStep('loading'); setTimeout(() => setStep('dashboard'), 2500); };
  const handleLogout = () => { localStorage.clear(); setStep('auth'); setOnboardingSubStep(1); setView('main'); };
  const toggleScrap = (id) => setSavedPolicyIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans tracking-tight relative">
      <AnimatePresence mode="wait">
        
        {step === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
              <div className="text-center mb-8"><div className="text-3xl mb-3">🐥</div><h1 className="text-2xl font-black text-gray-900 mb-1.5">둥지탈출</h1><p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Premium Housing Curation</p></div>
              <form onSubmit={(e) => { e.preventDefault(); setStep('onboarding'); }} className="space-y-5">

                <InputField label="이름(닉네임)" icon={CheckCircle2} placeholder="실명 입력" required value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                <InputField label="이메일" icon={FileText} placeholder="example@email.com" type="email" required value={user.email} onChange={e => setUser({...user, email: e.target.value})} />
                <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all text-sm">무료 진단 시작하기</button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
              <div className="flex gap-1.5 mb-8">{[1, 2, 3].map(i => (<div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-500", onboardingSubStep >= i ? "bg-primary" : "bg-gray-100")} />))}</div>
              <div className="text-center mb-7"><h1 className="text-xl font-black text-gray-900 mb-1.5">{onboardingSubStep === 1 ? "개인 프로필 설정" : onboardingSubStep === 2 ? "경제 스펙 분석" : "주거 인프라 진단"}</h1><p className="text-gray-400 text-xs font-bold">1:1 초개인화 알고리즘 분석을 위해 정보를 입력하세요.</p></div>
              <form onSubmit={onboardingSubStep === 3 ? handleStart : (e) => { e.preventDefault(); setOnboardingSubStep(s => s+1); }} className="space-y-5">
                {onboardingSubStep === 1 && (
                  <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-5">
                    <InputField label="생년월일" icon={Clock} type="date" required value={user.birthdate} onChange={e => setUser({...user, birthdate: e.target.value})} />
                    <div className="space-y-2"><label className="text-[11px] font-black text-gray-500 flex items-center gap-1.5"><TrendingUp size={14} className="text-primary" />직업 분류</label><div className="grid grid-cols-2 gap-2">{OCCUPATIONS.map(occ => (<SelectionCard key={occ} label={occ} selected={user.occupation === occ} onClick={() => setUser({...user, occupation: occ})} />))}</div></div>
                    <div className="space-y-2"><label className="text-[11px] font-black text-gray-500 flex items-center gap-1.5"><CheckCircle2 size={14} className="text-primary" />혼인 구분</label><div className="grid grid-cols-3 gap-2">{MARITAL_STATUS.map(ms => (<SelectionCard key={ms} label={ms} selected={user.maritalStatus === ms} onClick={() => setUser({...user, maritalStatus: ms})} />))}</div></div>
                  </motion.div>
                )}
                {onboardingSubStep === 2 && (
                  <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-5">
                    <InputField label="작년 연소득 (만원)" icon={Wallet} placeholder="예: 3500" type="number" required value={user.income} onChange={e => setUser({...user, income: e.target.value})} />
                    <InputField label="보유 자산 (만원)" icon={TrendingUp} placeholder="예: 12000" type="number" required value={user.assets} onChange={e => setUser({...user, assets: e.target.value})} />
                  </motion.div>
                )}
                {onboardingSubStep === 3 && (
                  <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-5">
                    <InputField label="거주 희망 지역" icon={MapPin} placeholder="서울, 경기 등" required value={user.region} onChange={e => setUser({...user, region: e.target.value})} />
                    <div className="space-y-2"><label className="text-[11px] font-black text-gray-500 flex items-center gap-1.5"><MapPin size={14} className="text-primary" />현재 주거지</label><div className="grid grid-cols-2 gap-2">{HOUSING_TYPES.map(ht => (<SelectionCard key={ht} label={ht} selected={user.housingType === ht} onClick={() => setUser({...user, housingType: ht})} />))}</div></div>
                    <InputField label="무주택 기간 (년)" icon={Clock} placeholder="예: 5" type="number" required value={user.homelessPeriod} onChange={e => setUser({...user, homelessPeriod: e.target.value})} />
                  </motion.div>
                )}
                <div className="flex gap-2 pt-4">
                  {onboardingSubStep > 1 && (<button type="button" onClick={() => setOnboardingSubStep(s => s-1)} className="flex-1 py-3.5 bg-gray-100 text-gray-500 font-bold rounded-xl text-sm">이전</button>)}
                  <button type="submit" className="flex-[2] py-3.5 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 text-sm">{onboardingSubStep === 3 ? "분석 리포트 생성" : "다음 단계"}</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <Activity size={40} className="text-primary animate-spin mb-6" />
            <h2 className="text-xl font-black text-gray-900 mb-1.5">알고리즘 분석 중...</h2>
            <p className="text-gray-400 text-sm font-medium">님의 데이터를 전국 300여개 주거 공고와 대조합니다.</p>
          </motion.div>
        )}

        {step === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-16">
            
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
              <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
                <div className="text-primary font-black text-xl cursor-pointer tracking-tight" onClick={() => setView('main')}>둥지탈출</div>
                <nav className="hidden sm:flex items-center gap-6">
                  <button onClick={() => setView('main')} className={cn("text-[13px] font-black transition-colors", view === 'main' ? "text-primary" : "text-gray-400")}>추천</button>
                  <button onClick={() => setView('mypage')} className={cn("text-[13px] font-black transition-colors", view === 'mypage' ? "text-primary" : "text-gray-400")}>내 정보</button>
                </nav>
                <button onClick={() => setView('mypage')} className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black shadow-sm">{user.name.substring(0, 1)}</button>
              </div>
            </header>

            <main className="max-w-6xl mx-auto px-5 pt-8">
              {view === 'main' ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-primary p-6 rounded-[1.5rem] text-white shadow-xl shadow-primary/20">
                      <p className="text-[10px] font-black opacity-80 uppercase mb-1">Total Expected Benefit</p>
                      <h2 className="text-2xl font-black">{totalBenefitAmount.toLocaleString()}만원</h2>
                    </div>
                    <motion.div onClick={() => {setSpecialFilter('자격충족'); setFilter('전체');}} className={cn("p-5 rounded-[1.5rem] border transition-all cursor-pointer flex items-center gap-4", specialFilter === '자격충족' ? "bg-green-500 border-green-500 text-white shadow-lg" : "bg-white border-gray-100 shadow-sm")}>
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", specialFilter === '자격충족' ? "bg-white/20" : "bg-green-50 text-green-500")}><CheckCircle2 size={20} /></div>
                      <div><p className="text-[10px] font-black uppercase opacity-70">충족 정책</p><h3 className="text-xl font-black">{processedPolicies.filter(p => p.tag === '자격충족').length}건</h3></div>
                    </motion.div>
                    <motion.div onClick={() => {setSpecialFilter('마감임박'); setFilter('전체');}} className={cn("p-5 rounded-[1.5rem] border transition-all cursor-pointer flex items-center gap-4", specialFilter === '마감임박' ? "bg-orange-500 border-orange-500 text-white shadow-lg" : "bg-white border-gray-100 shadow-sm")}>
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", specialFilter === '마감임박' ? "bg-white/20" : "bg-orange-50 text-orange-500")}><Clock size={20} /></div>
                      <div><p className="text-[10px] font-black uppercase opacity-70">마감 임박</p><h3 className="text-xl font-black">{processedPolicies.filter(p => p.dDay.includes('D-') && parseInt(p.dDay.replace('D-', '')) <= 7).length}건</h3></div>
                    </motion.div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="space-y-1">
                          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            {specialFilter ? (specialFilter === '자격충족' ? '✅ 자격 충족 리스트' : '⏰ 마감 직전 공고') : '🎯 오늘의 맞춤 추천'}
                            {specialFilter && <button onClick={() => setSpecialFilter(null)} className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full hover:text-primary transition-colors">전체보기</button>}
                          </h2>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Based on your spec and recent interests</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="relative w-full sm:w-64">
                            <input 
                              type="text" 
                              placeholder="정책 검색 (예: 청년, 전세)" 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onBlur={() => searchQuery && setSearchHistory(prev => Array.from(new Set([searchQuery, ...prev])).slice(0, 5))}
                              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                            <Bot size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0">{['전체', '대출지원', '월세지원', '공공임대', '공공분양', '전세임대'].map(cat => (<FilterButton key={cat} label={cat} active={filter === cat} onClick={() => setFilter(cat)} />))}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPolicies.length > 0 ? filteredPolicies.map((p, i) => (<PolicyCard key={p.id} policy={p} onClick={() => setSelectedPolicy(p)} isScrapped={savedPolicyIds.includes(p.id)} onScrap={toggleScrap} isHighlyRecommended={i < 2 && !specialFilter && filter === '전체'} />)) : (
                          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                            <Bot size={40} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400 font-black text-sm">검색 결과가 없습니다.</p>
                            <button onClick={() => setSearchQuery('')} className="mt-4 text-xs font-black text-primary underline">초기화</button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <aside className="lg:w-72 space-y-6">
                      <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-black text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-50 pb-3"><Activity size={16} className="text-primary" />급상승 인기 랭킹</h2>
                        <div className="space-y-4">{processedPolicies.slice(0, 5).sort((a,b) => b.views - a.views).map((p, i) => (
                          <div key={p.id} onClick={() => setSelectedPolicy(p)} className="flex items-center gap-3 cursor-pointer group">
                            <div className={cn("w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-black transition-colors", i < 3 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400")}>{i+1}</div>
                            <h3 className="text-[11px] font-bold text-gray-600 group-hover:text-primary truncate transition-colors">{p.title}</h3>
                          </div>
                        ))}</div>
                      </div>
                      <button onClick={() => setShowMentoring(true)} className="w-full bg-blue-600 text-white p-5 rounded-[1.5rem] shadow-lg shadow-blue-200 flex flex-col items-center gap-2 hover:scale-[1.02] transition-all">
                        <Bot size={24}/><span className="text-xs font-black">AI & 전문가 멘토링 신청</span>
                      </button>
                    </aside>
                  </div>
                </div>
              ) : (
                /* --- MY PAGE VIEW --- */
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center mb-6">
                          <div className="w-20 h-20 bg-gray-50 text-primary rounded-full flex items-center justify-center text-3xl font-black mb-3 border border-gray-100">{user.name.substring(0, 1)}</div>
                          <h2 className="text-lg font-black">{user.name}님</h2>
                          <p className="text-gray-400 text-[11px] font-bold">{user.email}</p>
                        </div>
                        <div className="space-y-2.5 pt-4 border-t border-gray-50">
                          <div className="flex justify-between text-[11px]"><span className="text-gray-400 font-bold uppercase">Occupation</span><span className="font-black text-gray-900">{user.occupation}</span></div>
                          <div className="flex justify-between text-[11px]"><span className="text-gray-400 font-bold uppercase">Income</span><span className="font-black text-primary">{parseInt(user.income).toLocaleString()}만원</span></div>
                        </div>
                        <button onClick={() => setIsEditingProfile(true)} className="w-full mt-6 py-2.5 bg-gray-50 text-gray-600 text-xs font-black rounded-xl hover:bg-gray-100 transition-all">정보 수정</button>
                        <button onClick={handleLogout} className="w-full mt-2 py-2 text-red-400 text-[10px] font-black hover:bg-red-50 rounded-xl transition-all">로그아웃</button>
                      </div>

                      {/* Point 7: Curation Insight Report */}
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-[2rem] text-white shadow-xl">
                        <h4 className="text-[10px] font-black text-primary uppercase mb-3 flex items-center gap-1.5"><BarChart3 size={12}/> 알고리즘 추천 리포트</h4>
                        <div className="space-y-3">
                          <div className="bg-white/5 p-3 rounded-xl">
                            <p className="text-[9px] text-gray-400 font-bold mb-1">나의 주거 매칭 지수</p>
                            <div className="flex items-end gap-1"><span className="text-2xl font-black text-white">{reportScore}</span><span className="text-[10px] text-gray-400 mb-1.5">/100</span></div>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">님의 소득과 거주지 조건을 분석한 결과, <span className="text-white font-bold">{processedPolicies[0]?.category}</span> 분야에서 가장 높은 혜택이 예상됩니다.</p>
                          <div className="pt-2 border-t border-white/10 space-y-2">
                            <p className="text-[9px] font-black text-primary uppercase">Score Up Tips</p>
                            <ul className="text-[9px] text-gray-400 space-y-1">
                              <li>• 거주 희망 지역을 &apos;전국&apos;으로 확장해 보세요.</li>
                              <li>• 더 많은 정책을 검색할수록 큐레이션이 정확해집니다.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 space-y-8">
                      <section className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-black mb-5 flex items-center gap-2"><Activity size={18} className="text-primary"/> 실시간 심사 현황 트래커 (포트폴리오)</h2>
                        <div className="space-y-3">
                          {appliedPolicies.length > 0 ? appliedPolicies.map((app, i) => (
                            <div key={i} onClick={() => setSelectedPolicy(app)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
                              <div><h3 className="font-black text-sm text-gray-900">{app.title}</h3><p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5"><Clock size={10}/> 신청일: {app.applyDate}</p></div>
                              <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 font-black text-[10px] text-gray-700 shadow-sm flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>{app.appStatus}</div>
                            </div>
                          )) : (<p className="text-center py-8 text-gray-400 text-xs font-bold tracking-widest">신청 내역이 없습니다.</p>)}
                        </div>
                      </section>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm">
                          <h2 className="text-sm font-black mb-4 flex items-center gap-2"><FileCheck size={16} className="text-green-500"/> 내 서류 보관함</h2>
                          <div className="flex flex-wrap gap-2">
                            {issuedDocs.length > 0 ? issuedDocs.map((doc, i) => (<div key={i} className="px-3 py-2 bg-green-50 text-green-700 text-[10px] font-black rounded-lg border border-green-100 flex items-center gap-1.5"><FileText size={12}/>{doc}</div>)) : (<p className="text-gray-400 text-[10px] font-bold">발급된 서류가 없습니다.</p>)}
                          </div>
                        </section>
                        <section className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm">
                          <h2 className="text-sm font-black mb-4 flex items-center gap-2 text-red-500"><Heart size={16} fill="currentColor"/> 관심 정책 ({savedPolicyIds.length})</h2>
                          <div className="space-y-2">
                            {savedPolicies.slice(0, 3).map(p => (<div key={p.id} onClick={() => setSelectedPolicy(p)} className="text-[11px] font-bold text-gray-600 truncate border-b border-gray-50 pb-2 cursor-pointer hover:text-primary transition-colors">{p.title}</div>))}
                            {savedPolicies.length > 3 && <p className="text-[9px] text-gray-400 text-center pt-1">+ {savedPolicyIds.length - 3}개 더보기</p>}
                            {savedPolicies.length === 0 && <p className="text-gray-400 text-[10px] font-bold">관심 정책이 없습니다.</p>}
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </main>

            {/* Profile Edit Modal */}
            <AnimatePresence>
              {isEditingProfile && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)}>
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-sm rounded-[2rem] p-7 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-black">프로필 수정</h2><button onClick={() => setIsEditingProfile(false)} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={16} /></button></div>
                    <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('nest-user', JSON.stringify(user)); setIsEditingProfile(false); }} className="space-y-4">
                      <InputField label="이름" icon={CheckCircle2} value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                      <InputField label="작년 연소득 (만원)" icon={Wallet} type="number" value={user.income} onChange={e => setUser({...user, income: e.target.value})} />
                      <InputField label="거주지" icon={MapPin} value={user.region} onChange={e => setUser({...user, region: e.target.value})} />
                      <button type="submit" className="w-full mt-4 py-3.5 bg-primary text-white font-black rounded-xl hover:brightness-110 transition-all text-sm">수정 완료</button>
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
            onOpenAlert={() => setShowAlert(true)}
            issuedDocs={issuedDocs}
            setIssuedDocs={setIssuedDocs}
            userData={user}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{showAlert && selectedPolicy && <EmailAlertModal policy={selectedPolicy} onClose={() => setShowAlert(false)} />}</AnimatePresence>
      <AnimatePresence>{showMentoring && <MentoringModal onClose={() => setShowMentoring(false)} onOpenAI={() => setShowAIChat(true)} />}</AnimatePresence>
      <AnimatePresence>{showMockApply && selectedPolicy && (<MockApplyModal policy={selectedPolicy} onClose={() => setShowMockApply(false)} setApplications={setApplications} />)}</AnimatePresence>
      <AnimatePresence>{showAIChat && <AIChatbotModal onClose={() => setShowAIChat(false)} userData={user} />}</AnimatePresence>

    </div>
  );
}
