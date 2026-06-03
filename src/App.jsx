import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Wallet, TrendingUp, ChevronRight, 
  CheckCircle2, Clock, Info, X, FileText, AlertCircle,
  Heart, User, Home, ArrowLeft, Bookmark, Share2
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

const PolicyCard = ({ policy, onClick, isScrapped, onScrap }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full">
        {policy.category}
      </span>
      <div className="flex gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onScrap(policy.id); }}
          className={cn(
            "p-2 rounded-full transition-all",
            isScrapped ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:text-red-400"
          )}
        >
          <Heart size={16} fill={isScrapped ? "currentColor" : "none"} />
        </button>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded",
          policy.tag === "자격충족" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
        )}>
          {policy.tag}
        </span>
      </div>
    </div>
    <h3 className="text-lg font-bold mb-2 text-gray-900">{policy.title}</h3>
    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{policy.summary}</p>
    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
      <div className="flex items-center gap-1 text-red-500 font-bold text-sm">
        <Clock size={14} />
        {policy.dDay}
      </div>
      <div className="text-primary text-sm font-semibold flex items-center">
        자세히 보기 <ChevronRight size={16} />
      </div>
    </div>
  </motion.div>
);

const FilterButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-xl text-sm font-bold transition-all",
      active ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
    )}
  >
    {label}
  </button>
);

const Modal = ({ policy, onClose, isScrapped, onScrap }) => {
  if (!policy) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-32 bg-primary flex items-end p-6">
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => onScrap(policy.id)} 
              className={cn(
                "p-2 rounded-full transition-colors",
                isScrapped ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Heart size={20} fill={isScrapped ? "white" : "none"} />
            </button>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="text-white">
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded mb-2 inline-block">{policy.category}</span>
            <h2 className="text-2xl font-bold">{policy.title}</h2>
          </div>
        </div>
        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div><h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">지원 혜택</h4><p className="text-xl font-bold text-primary">{policy.benefit}</p></div>
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">합격 예상도</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${policy.probability}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-primary" />
              </div>
              <span className="font-bold text-primary">{policy.probability}%</span>
            </div>
          </div>
          <div><h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">상세 자격 조건</h4><p className="text-gray-700 leading-relaxed">{policy.details}</p></div>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={18} className="text-primary" />필요 서류 체크리스트</h4>
            <div className="grid grid-cols-1 gap-3">
              {policy.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-md border border-gray-300 flex items-center justify-center"><CheckCircle2 size={14} className="text-gray-300" /></div>
                  {doc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [step, setStep] = useState('auth'); 
  const [view, setView] = useState('main'); // 'main' or 'mypage'
  const [onboardingSubStep, setOnboardingSubStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ 
    name: '', email: '', birthdate: '', occupation: '', maritalStatus: '', 
    region: '', income: '', assets: '', housingType: '', homelessPeriod: '' 
  });
  const [savedPolicyIds, setSavedPolicyIds] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [filter, setFilter] = useState('전체');
  const [specialFilter, setSpecialFilter] = useState(null);

  // 로컬 스토리지 데이터 로드
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('nest-user');
      const savedScraps = localStorage.getItem('nest-scraps');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.name) {
          setUser(parsedUser);
          setIsLoggedIn(true);
          setStep('dashboard');
        }
      }
      if (savedScraps) {
        setSavedPolicyIds(JSON.parse(savedScraps));
      }
    } catch (error) { 
      localStorage.removeItem('nest-user'); 
      localStorage.removeItem('nest-scraps');
    }
  }, []);

  // 정책 필터링 및 매칭 로직 고도화
  const processedPolicies = useMemo(() => {
    const userIncome = parseInt(user.income) || 0;
    const userRegion = user.region || '';
    const userOccupation = user.occupation || '';

    return POLICIES.map(p => {
      let matchScore = 0;
      let tag = "확인필요";

      // 1. 소득 조건 체크
      const isIncomeMatch = userIncome >= p.minIncome && userIncome <= p.maxIncome;
      if (isIncomeMatch) matchScore += 40;

      // 2. 지역 조건 체크 (전국이거나 사용자의 지역을 포함하는지)
      const isRegionMatch = p.regions.includes("전국") || userRegion.includes(p.regions[0]);
      if (isRegionMatch) matchScore += 30;

      // 3. 직업 조건 체크
      const isOccupationMatch = p.occupations.includes(userOccupation);
      if (isOccupationMatch) matchScore += 30;

      // 태그 결정
      if (isIncomeMatch && isRegionMatch && isOccupationMatch) {
        tag = "자격충족";
      } else if (isIncomeMatch || isRegionMatch) {
        tag = "확인필요";
      } else {
        tag = "부적격";
      }

      // 점수 보정 (조회수, 신청자수)
      matchScore += (p.views / 10000) * 5 + (p.applicants / 10000) * 5;

      return { ...p, matchScore: Math.round(matchScore), tag };
    });
  }, [user]);

  const filteredPolicies = useMemo(() => {
    let list = processedPolicies.filter(p => p.tag !== "부적격");
    
    if (filter !== '전체') list = list.filter(p => p.category === filter);
    
    if (specialFilter === '자격충족') {
      list = list.filter(p => p.tag === '자격충족');
    } else if (specialFilter === '마감임박') {
      list = list.filter(p => p.dDay.includes('D-') && parseInt(p.dDay.replace('D-', '')) <= 7);
    }
    
    return list.sort((a, b) => b.matchScore - a.matchScore);
  }, [processedPolicies, filter, specialFilter]);

  // 총 혜택 금액 계산
  const totalBenefitAmount = useMemo(() => {
    return processedPolicies
      .filter(p => p.tag === "자격충족")
      .reduce((acc, curr) => acc + curr.benefitAmount, 0);
  }, [processedPolicies]);

  const savedPolicies = useMemo(() => {
    return processedPolicies.filter(p => savedPolicyIds.includes(p.id));
  }, [processedPolicies, savedPolicyIds]);

  const trendingPolicies = [...processedPolicies].sort((a, b) => b.views - a.views).slice(0, 3);

  const handleLogin = (e) => { e.preventDefault(); setIsLoggedIn(true); setStep('onboarding'); };
  const handleNextSubStep = (e) => { e.preventDefault(); setOnboardingSubStep(prev => prev + 1); };
  const handlePrevSubStep = () => setOnboardingSubStep(prev => prev - 1);
  const handleStart = (e) => {
    e.preventDefault();
    localStorage.setItem('nest-user', JSON.stringify(user));
    setStep('loading');
    setTimeout(() => setStep('dashboard'), 2500);
  };
  const handleUpdateProfile = (e) => { 
    e.preventDefault(); 
    localStorage.setItem('nest-user', JSON.stringify(user)); 
    setIsEditingProfile(false); 
  };
  const handleLogout = () => { 
    localStorage.removeItem('nest-user'); 
    localStorage.removeItem('nest-scraps');
    setIsLoggedIn(false); 
    setStep('auth'); 
    setOnboardingSubStep(1); 
    setSavedPolicyIds([]);
  };

  const toggleScrap = (id) => {
    const newScraps = savedPolicyIds.includes(id) 
      ? savedPolicyIds.filter(sid => sid !== id)
      : [...savedPolicyIds, id];
    setSavedPolicyIds(newScraps);
    localStorage.setItem('nest-scraps', JSON.stringify(newScraps));
  };

  return (
    <div className="min-h-screen bg-secondary-bg text-gray-900">
      <AnimatePresence mode="wait">
        {step === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <div className="text-center mb-10"><div className="text-4xl mb-4">🐥</div><h1 className="text-3xl font-black text-gray-900 mb-2">둥지탈출 시작하기</h1><p className="text-gray-500 font-medium">더 나은 주거 환경을 위한 첫 걸음</p></div>
              <form onSubmit={handleLogin} className="space-y-6">
                <InputField label="이름(닉네임)" icon={CheckCircle2} placeholder="사용하실 이름을 입력해주세요" required value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                <InputField label="이메일" icon={FileText} placeholder="example@email.com" type="email" required value={user.email} onChange={e => setUser({...user, email: e.target.value})} />
                <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all text-lg">간편 가입 및 로그인</button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <div className="flex gap-2 mb-8">{[1, 2, 3].map(i => (<div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", onboardingSubStep >= i ? "bg-primary" : "bg-gray-100")} />))}</div>
              <div className="text-center mb-8"><h1 className="text-2xl font-black text-gray-900 mb-2">{onboardingSubStep === 1 ? "기본 정보 입력" : onboardingSubStep === 2 ? "경제 활동 정보" : "주거 현황 정보"}</h1><p className="text-gray-500 font-medium">정확한 정책 매칭을 위해 정보를 입력해주세요.</p></div>
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
                    {onboardingSubStep === 3 ? "진단하기" : "다음 단계"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
            <div className="space-y-2"><h2 className="text-xl font-bold text-gray-900">{user.name}님의 프로필을 분석 중입니다</h2><p className="text-gray-500">전국 300여 개의 주거 정책과 대조하고 있어요...</p></div>
          </motion.div>
        )}

        {step === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
              <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div 
                  className="text-primary font-black text-xl cursor-pointer"
                  onClick={() => setView('main')}
                >
                  둥지탈출
                </div>
                <nav className="hidden md:flex items-center gap-8">
                  <button onClick={() => setView('main')} className={cn("text-sm font-bold transition-colors", view === 'main' ? "text-primary" : "text-gray-400 hover:text-gray-600")}>홈</button>
                  <button onClick={() => setView('mypage')} className={cn("text-sm font-bold transition-colors", view === 'mypage' ? "text-primary" : "text-gray-400 hover:text-gray-600")}>마이페이지</button>
                </nav>
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('mypage')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                    {user.name.substring(0, 1)}
                  </button>
                </div>
              </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-10">
              {view === 'main' ? (
                <>
                  <div className="mb-8 p-6 bg-white border border-gray-100 rounded-3xl flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-sm"><MapPin size={16} className="text-primary" /><span className="font-bold">{user.region || '미설정'}</span></div>
                      <div className="flex items-center gap-2 text-sm"><Wallet size={16} className="text-primary" /><span className="font-bold">{user.income ? `${parseInt(user.income).toLocaleString()}만원` : '0원'}</span></div>
                      <div className="flex items-center gap-2 text-sm"><TrendingUp size={16} className="text-primary" /><span className="font-bold">{user.assets ? `${parseInt(user.assets).toLocaleString()}만원` : '0원'}</span></div>
                    </div>
                    <button onClick={() => setIsEditingProfile(true)} className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all">내 조건 수정하기</button>
                  </div>

                  <div className="mb-12">
                    <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                      <span className="text-primary">{user.name}님</span>을 위한<br />맞춤 주거 정책 진단 결과입니다 🏠
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-primary p-6 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
                        <p className="text-white/80 text-sm font-medium mb-1">최대 예상 혜택</p>
                        <h2 className="text-3xl font-black">{totalBenefitAmount.toLocaleString()}만원</h2>
                      </div>
                      <motion.div whileHover={{ y: -5 }} onClick={() => {setSpecialFilter('자격충족'); setFilter('전체');}} className={cn("p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-4", specialFilter === '자격충족' ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-100")}>
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", specialFilter === '자격충족' ? "bg-white/20 text-white" : "bg-green-50 text-green-500")}><CheckCircle2 size={24} /></div>
                        <div><p className="text-xs font-bold uppercase">충족 정책</p><h3 className="text-xl font-black">{processedPolicies.filter(p => p.tag === '자격충족').length}건</h3></div>
                      </motion.div>
                      <motion.div whileHover={{ y: -5 }} onClick={() => {setSpecialFilter('마감임박'); setFilter('전체');}} className={cn("p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-4", specialFilter === '마감임박' ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-100")}>
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", specialFilter === '마감임박' ? "bg-white/20 text-white" : "bg-orange-50 text-orange-500")}><AlertCircle size={24} /></div>
                        <div><p className="text-xs font-bold uppercase">마감 임박</p><h3 className="text-xl font-black">{processedPolicies.filter(p => p.dDay.includes('D-') && parseInt(p.dDay.replace('D-', '')) <= 7).length}건</h3></div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-gray-900">
                            {specialFilter ? (specialFilter === '자격충족' ? '✅ 충족 정책' : '⏰ 마감 임박') : `${user.name}님 추천 리스트`}
                          </h2>
                          {specialFilter && (
                            <button onClick={() => setSpecialFilter(null)} className="text-xs text-gray-400 hover:text-primary font-bold">필터 해제</button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">{['전체', '대출지원', '월세지원', '공공임대', '자산형성'].map(cat => (<FilterButton key={cat} label={cat} active={filter === cat} onClick={() => setFilter(cat)} />))}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPolicies.map(policy => (
                          <PolicyCard 
                            key={policy.id} 
                            policy={policy} 
                            onClick={() => setSelectedPolicy(policy)} 
                            isScrapped={savedPolicyIds.includes(policy.id)}
                            onScrap={toggleScrap}
                          />
                        ))}
                      </div>
                    </div>
                    <aside className="lg:w-80 space-y-8">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp size={18} className="text-orange-500" />실시간 인기 정책</h2>
                        <div className="space-y-4">{trendingPolicies.map((p, i) => (
                          <div key={p.id} onClick={() => setSelectedPolicy(p)} className="flex items-center gap-4 cursor-pointer p-2 rounded-2xl hover:bg-gray-50 transition-all">
                            <div className="w-8 h-8 flex-shrink-0 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center text-sm font-black">{i+1}</div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm text-gray-900 truncate">{p.title}</h3>
                              <p className="text-[10px] text-gray-400">{(p.views/1000).toFixed(1)}k Views</p>
                            </div>
                          </div>
                        ))}</div>
                      </div>
                    </aside>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setView('main')} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-black">마이페이지</h1>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center text-center mb-8">
                          <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center text-3xl font-black mb-4">
                            {user.name.substring(0, 1)}
                          </div>
                          <h2 className="text-2xl font-black">{user.name}님</h2>
                          <p className="text-gray-400 font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-gray-50">
                          <div className="flex justify-between items-center"><span className="text-sm text-gray-500">직업</span><span className="font-bold text-sm">{user.occupation}</span></div>
                          <div className="flex justify-between items-center"><span className="text-sm text-gray-500">거주지</span><span className="font-bold text-sm">{user.region}</span></div>
                          <div className="flex justify-between items-center"><span className="text-sm text-gray-500">연소득</span><span className="font-bold text-sm">{parseInt(user.income).toLocaleString()}만원</span></div>
                        </div>
                        <button onClick={() => setIsEditingProfile(true)} className="w-full mt-8 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all">회원 정보 수정</button>
                        <button onClick={handleLogout} className="w-full mt-2 py-4 text-red-400 text-sm font-bold hover:bg-red-50 rounded-2xl transition-all">로그아웃</button>
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Heart size={20} className="text-red-500" fill="currentColor" /> 관심 정책 ({savedPolicies.length})
                        </h2>
                      </div>
                      
                      {savedPolicies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {savedPolicies.map(policy => (
                            <PolicyCard 
                              key={policy.id} 
                              policy={policy} 
                              onClick={() => setSelectedPolicy(policy)} 
                              isScrapped={true}
                              onScrap={toggleScrap}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <Bookmark size={32} />
                          </div>
                          <p className="text-gray-400 font-medium mb-6">아직 관심 정책이 없습니다.<br />나에게 맞는 정책을 찾아 찜해보세요!</p>
                          <button onClick={() => setView('main')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all">정책 둘러보기</button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </main>

            <AnimatePresence>
              {isEditingProfile && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)}>
                  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">조건 수정</h2><button onClick={() => setIsEditingProfile(false)} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20} /></button></div>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      <InputField label="이름" icon={CheckCircle2} value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                      <InputField label="작년 연소득" icon={Wallet} type="number" value={user.income} onChange={e => setUser({...user, income: e.target.value})} />
                      <InputField label="보유 자산" icon={TrendingUp} type="number" value={user.assets} onChange={e => setUser({...user, assets: e.target.value})} />
                      <InputField label="거주 지역" icon={MapPin} value={user.region} onChange={e => setUser({...user, region: e.target.value})} />
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">직업 상태</label>
                        <div className="grid grid-cols-2 gap-2">
                          {OCCUPATIONS.map(occ => (
                            <SelectionCard key={occ} label={occ} selected={user.occupation === occ} onClick={() => setUser({...user, occupation: occ})} />
                          ))}
                        </div>
                      </div>
                      <button type="submit" className="w-full mt-4 py-4 bg-primary text-white font-bold rounded-2xl hover:brightness-110 transition-all">저장하기</button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedPolicy && (
          <Modal 
            policy={selectedPolicy} 
            onClose={() => setSelectedPolicy(null)} 
            isScrapped={savedPolicyIds.includes(selectedPolicy.id)}
            onScrap={toggleScrap}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
