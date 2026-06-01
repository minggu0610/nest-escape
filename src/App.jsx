import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Wallet, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Info, 
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Dummy Data ---
const POLICIES = [
  {
    id: 1,
    title: "청년전용 보증부월세대출",
    category: "대출지원",
    tag: "자격충족",
    summary: "저소득 청년을 대상으로 보증금과 월세를 동시에 지원하는 전용 대출 상품",
    dDay: "상시접수",
    benefit: "연 1.0%~1.3% 저금리",
    probability: 92,
    details: "만 19세~34세, 연소득 5천만원 이하 무주택 청년 대상",
    documents: ["주민등록등본", "가족관계증명서", "소득금액증명원", "임대차계약서"],
    views: 1240,
    applicants: 850,
    minIncome: 0,
    maxIncome: 5000
  },
  {
    id: 2,
    title: "청년 월세 한시 특별지원",
    category: "월세지원",
    tag: "확인필요",
    summary: "경제적 어려움을 겪는 청년층의 주거비 부담 경감을 위해 월세를 지원",
    dDay: "D-15",
    benefit: "월 최대 20만원 지원",
    probability: 75,
    details: "부모님과 별도 거주하는 무주택 청년 (중위소득 60% 이하)",
    documents: ["월세이체확인증", "임대차계약서", "통장사본"],
    views: 3500,
    applicants: 2100,
    minIncome: 0,
    maxIncome: 3000
  },
  {
    id: 3,
    title: "SH/LH 청년 매입임대주택",
    category: "공공임대",
    tag: "자격충족",
    summary: "도심 내 기존 주택을 매입하여 개보수 후 청년들에게 저렴하게 임대",
    dDay: "D-3",
    benefit: "시세의 30~50% 수준",
    probability: 60,
    details: "대학생, 취업준비생 및 만 19세~39세 청년",
    documents: ["주민등록등본", "자산보유사실확인서", "재학증명서(해당자)"],
    views: 5600,
    applicants: 1200,
    minIncome: 0,
    maxIncome: 4000
  },
  {
    id: 4,
    title: "청년도약계좌 (주거 특화)",
    category: "자산형성",
    tag: "자격충족",
    summary: "주거 독립 자금 마련을 위한 청년 대상 고금리 저축 상품",
    dDay: "매달 초",
    benefit: "정부 기여금 + 비과세",
    probability: 99,
    details: "개인소득 7,500만원 이하, 가구소득 180% 이하 청년",
    documents: ["소득확인서류", "신분증"],
    views: 8900,
    applicants: 4500,
    minIncome: 0,
    maxIncome: 7500
  },
  {
    id: 5,
    title: "버팀목 전세자금대출",
    category: "대출지원",
    tag: "자격충족",
    summary: "무주택 서민의 주거 안정을 위한 저금리 전세자금 대출",
    dDay: "상시접수",
    benefit: "연 1.8%~2.7% 금리",
    probability: 88,
    details: "부부합산 연소득 5천만원 이하 무주택 세대주",
    documents: ["확정일자부 임대차계약서", "주민등록등본", "소득증빙서류"],
    views: 4200,
    applicants: 3100,
    minIncome: 0,
    maxIncome: 5000
  }
];

// --- Components ---

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

// --- Main App ---

export default function App() {
  const [step, setStep] = useState('auth'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ 
    name: '', 
    income: '', 
    assets: '', 
    region: '',
    email: '' 
  });
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [filter, setFilter] = useState('전체');

  // 추천 및 필터링 로직
  const getFilteredPolicies = () => {
    let list = [...POLICIES];
    
    // 1. 카테고리 필터링
    if (filter !== '전체') {
      list = list.filter(p => p.category === filter);
    }

    // 2. 가상 알고리즘 적용 (소득 기반 매칭 점수 계산)
    return list.map(p => {
      let matchScore = 0;
      const userIncome = parseInt(user.income) || 0;
      
      // 소득 범위 안에 있으면 기본 점수 부여
      if (userIncome >= p.minIncome && userIncome <= p.maxIncome) {
        matchScore += 50;
        // 소득이 최대치에 가까울수록 더 절실한 정책이라고 가정
        matchScore += (userIncome / p.maxIncome) * 30;
      }
      
      // 조회수와 신청자수 기반 인기도 합산
      matchScore += (p.views / 1000) * 10;
      matchScore += (p.applicants / 1000) * 10;

      return { ...p, matchScore: Math.round(matchScore) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const trendingPolicies = [...POLICIES].sort((a, b) => b.views - a.views).slice(0, 3);
  const filteredPolicies = getFilteredPolicies();

  // ... (이전과 동일한 핸들러들)

  // 로컬 스토리지에서 유저 정보 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem('nest-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      setStep('dashboard');
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // 간단한 로그인 시뮬레이션
    setIsLoggedIn(true);
    setStep('onboarding');
  };

  const handleStart = (e) => {
    e.preventDefault();
    localStorage.setItem('nest-user', JSON.stringify(user));
    setStep('loading');
    setTimeout(() => {
      setStep('dashboard');
    }, 2500);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('nest-user', JSON.stringify(user));
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('nest-user');
    setIsLoggedIn(false);
    setStep('auth');
    setUser({ name: '', income: '', assets: '', region: '', email: '' });
  };

  return (
    <div className="min-h-screen bg-secondary-bg">
      <AnimatePresence mode="wait">
        {step === 'auth' && (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <div className="text-center mb-10">
                <div className="text-4xl mb-4">🐥</div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">둥지탈출 시작하기</h1>
                <p className="text-gray-500 font-medium">더 나은 주거 환경을 위한 첫 걸음</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <InputField 
                  label="이름(닉네임)" 
                  icon={CheckCircle2}
                  placeholder="사용하실 이름을 입력해주세요"
                  required
                  value={user.name}
                  onChange={e => setUser({...user, name: e.target.value})}
                />
                <InputField 
                  label="이메일" 
                  icon={FileText}
                  placeholder="example@email.com"
                  type="email"
                  required
                  value={user.email}
                  onChange={e => setUser({...user, email: e.target.value})}
                />
                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all text-lg"
                >
                  간편 가입 및 로그인
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <div className="text-center mb-10">
                <h1 className="text-2xl font-black text-gray-900 mb-2">{user.name}님, 반갑습니다!</h1>
                <p className="text-gray-500 font-medium">정확한 정책 매칭을 위해 정보를 입력해주세요.</p>
              </div>

              <form onSubmit={handleStart} className="space-y-6">
                <InputField 
                  label="거주 희망 지역" 
                  icon={MapPin}
                  placeholder="예: 서울시 강남구"
                  required
                  value={user.region}
                  onChange={e => setUser({...user, region: e.target.value})}
                />
                <InputField 
                  label="작년 기준 연소득" 
                  icon={Wallet}
                  placeholder="단위: 만원 (예: 3200)"
                  type="number"
                  required
                  value={user.income}
                  onChange={e => setUser({...user, income: e.target.value})}
                />
                <InputField 
                  label="보유 자산 규모" 
                  icon={TrendingUp}
                  placeholder="예: 5000"
                  type="number"
                  required
                  value={user.assets}
                  onChange={e => setUser({...user, assets: e.target.value})}
                />

                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all text-lg"
                >
                  나만의 맞춤 정책 진단하기
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="space-y-2"
            >
              <h2 className="text-xl font-bold text-gray-900">{user.name}님의 프로필을 분석 중입니다</h2>
              <p className="text-gray-500">전국 300여 개의 주거 정책과 대조하고 있어요...</p>
            </motion.div>
          </motion.div>
        )}

        {step === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-20"
          >
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
              <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="text-primary font-black text-xl">둥지탈출</div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-600">{user.name}님</span>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    로그아웃
                  </button>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {user.name.substring(0, 1)}
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-10">
              {/* Profile Bar */}
              <div className="mb-8 p-6 bg-white border border-gray-100 rounded-3xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-primary" />
                    <span className="font-bold">{user.region || '미설정'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wallet size={16} className="text-primary" />
                    <span className="font-bold">{user.income ? `${parseInt(user.income).toLocaleString()}만원` : '0원'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp size={16} className="text-primary" />
                    <span className="font-bold">{user.assets ? `${parseInt(user.assets).toLocaleString()}만원` : '0원'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all"
                >
                  내 조건 수정하기
                </button>
              </div>

              {/* Hero Section */}
              <div className="mb-12">
                <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                  <span className="text-primary">{user.name}님</span>을 위한<br />
                  맞춤 주거 정책 진단 결과입니다 🏠
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-primary p-6 rounded-[2rem] text-white shadow-xl shadow-primary/20">
                    <p className="text-white/80 text-sm font-medium mb-1">최대 예상 혜택</p>
                    <h2 className="text-3xl font-black">2,400만원</h2>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase">충족 정책</p>
                      <h3 className="text-xl font-black text-gray-900">12건</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase">마감 임박</p>
                      <h3 className="text-xl font-black text-gray-900">2건</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trending Section */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-orange-500" />
                  지금 급상승 중인 정책
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingPolicies.map((policy, idx) => (
                    <motion.div 
                      key={policy.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPolicy(policy)}
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer flex items-center gap-4"
                    >
                      <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{policy.title}</h3>
                        <p className="text-xs text-gray-500">{(policy.views / 1000).toFixed(1)}k명이 확인 중</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Policy List with Filters */}
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {user.name}님께 딱 맞는 추천 리스트
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['전체', '대출지원', '월세지원', '공공임대', '자산형성'].map(cat => (
                      <FilterButton 
                        key={cat} 
                        label={cat} 
                        active={filter === cat} 
                        onClick={() => setFilter(cat)} 
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPolicies.map(policy => (
                    <div key={policy.id} className="relative">
                      {policy.matchScore > 70 && (
                        <div className="absolute -top-3 -left-3 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg animate-bounce">
                          강력추천
                        </div>
                      )}
                      <PolicyCard 
                        policy={policy} 
                        onClick={() => setSelectedPolicy(policy)}
                      />
                      <div className="absolute top-4 right-4 text-[10px] font-bold text-gray-400">
                        매칭률 {policy.matchScore}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banner */}
              <div className="mt-12 bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                  <h3 className="text-2xl font-bold mb-2">어떤 정책부터 시작해야 할지 모르겠나요?</h3>
                  <p className="text-blue-100 mb-6">둥지탈출 전담 멘토와 1:1 상담을 통해 가장 확률 높은 정책을 추천받아 보세요.</p>
                  <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                    무료 멘토링 신청하기
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mb-10 mr-20 blur-2xl" />
              </div>
            </main>

            {/* Profile Edit Modal */}
            <AnimatePresence>
              {isEditingProfile && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsEditingProfile(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">내 조건 수정</h2>
                      <button onClick={() => setIsEditingProfile(false)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <InputField 
                        label="이름" 
                        icon={CheckCircle2}
                        value={user.name}
                        onChange={e => setUser({...user, name: e.target.value})}
                      />
                      <InputField 
                        label="거주 희망 지역" 
                        icon={MapPin}
                        value={user.region}
                        onChange={e => setUser({...user, region: e.target.value})}
                      />
                      <InputField 
                        label="작년 기준 연소득" 
                        icon={Wallet}
                        type="number"
                        value={user.income}
                        onChange={e => setUser({...user, income: e.target.value})}
                      />
                      <InputField 
                        label="보유 자산 규모" 
                        icon={TrendingUp}
                        type="number"
                        value={user.assets}
                        onChange={e => setUser({...user, assets: e.target.value})}
                      />
                      <button 
                        type="submit"
                        className="w-full mt-4 py-4 bg-primary text-white font-bold rounded-2xl hover:brightness-110 transition-all"
                      >
                        저장하기
                      </button>
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
