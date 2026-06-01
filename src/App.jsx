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
    documents: ["주민등록등본", "가족관계증명서", "소득금액증명원", "임대차계약서"]
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
    documents: ["월세이체확인증", "임대차계약서", "통장사본"]
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
    documents: ["주민등록등본", "자산보유사실확인서", "재학증명서(해당자)"]
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
    documents: ["소득확인서류", "신분증"]
  }
];

// --- Components ---

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      <Icon size={16} className="text-primary" />
      {label}
    </label>
    <input 
      {...props}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
    />
  </div>
);

const PolicyCard = ({ policy, onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full">
        {policy.category}
      </span>
      <span className={cn(
        "text-xs font-medium px-2 py-1 rounded",
        policy.tag === "자격충족" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
      )}>
        {policy.tag}
      </span>
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

const Modal = ({ policy, onClose }) => {
  if (!policy) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-32 bg-primary flex items-end p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="text-white">
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded mb-2 inline-block">
              {policy.category}
            </span>
            <h2 className="text-2xl font-bold">{policy.title}</h2>
          </div>
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">지원 혜택</h4>
            <p className="text-xl font-bold text-primary">{policy.benefit}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">합격 예상도</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${policy.probability}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary"
                />
              </div>
              <span className="font-bold text-primary">{policy.probability}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Info size={12} /> 유사 프로필 사용자 통계 기반 데이터입니다.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">상세 자격 조건</h4>
            <p className="text-gray-700 leading-relaxed">{policy.details}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              필요 서류 체크리스트
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {policy.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-md border border-gray-300 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-gray-300" />
                  </div>
                  {doc}
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              전자증명서 원클릭 열람
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState('onboarding'); // 'onboarding', 'loading', 'dashboard'
  const [user, setUser] = useState({ name: '홍길동', income: '', assets: '', region: '' });
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const handleStart = (e) => {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => {
      setStep('dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-secondary-bg">
      <AnimatePresence mode="wait">
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
                <h1 className="text-3xl font-black text-gray-900 mb-2">둥지탈출 🐥</h1>
                <p className="text-gray-500 font-medium">청년 주거 정책, 딱 맞는 것만 골라드려요.</p>
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
              <h2 className="text-xl font-bold text-gray-900">사용자님의 프로필을 분석 중입니다</h2>
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
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    홍
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-10">
              {/* Hero Section */}
              <div className="mb-12">
                <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                  <span className="text-primary">홍길동님</span>을 위한<br />
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

              {/* Policy List */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    추천 매칭 리스트
                    <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Best 4</span>
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Search size={16} /> 필터링 적용 중
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {POLICIES.map(policy => (
                    <PolicyCard 
                      key={policy.id} 
                      policy={policy} 
                      onClick={() => setSelectedPolicy(policy)}
                    />
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
