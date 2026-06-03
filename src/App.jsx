import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Wallet, TrendingUp, ChevronRight, 
  CheckCircle2, Clock, Info, X, FileText, AlertCircle,
  Heart, User, Home, ArrowLeft, Bookmark, Share2,
  FileCheck, Bot, Users, Activity, Target, ShieldCheck, Download,
  Bell, BellRing, Settings, Lock, BarChart3, Fingerprint,
  MessageCircle, CornerDownRight
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
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
      <Icon size={14} className="text-primary" />
      {label}
    </label>
    <input 
      type={type}
      {...props}
      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
    />
  </div>
);

const FilterButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap border",
      active ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
    )}
  >
    {label}
  </button>
);

const PolicyCard = ({ policy, onClick, isScrapped, onScrap, isHighlyRecommended }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    onClick={onClick}
    className={cn(
      "relative bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col h-full",
      isHighlyRecommended ? "border-primary/40 bg-blue-50/10" : "border-gray-100"
    )}
  >
    {isHighlyRecommended && (
      <div className="absolute -top-2.5 -right-2 bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-tighter">
        <Target size={10} /> 강력추천
      </div>
    )}
    <div className="flex justify-between items-start mb-3">
      <span className="px-2.5 py-0.5 bg-blue-50 text-primary text-[10px] font-black rounded-md">
        {policy.category}
      </span>
      <div className="flex gap-1.5 items-center">
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded",
          policy.tag === "자격충족" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
        )}>
          {policy.tag}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onScrap(policy.id); }}
          className={cn(
            "p-1 rounded-full transition-all",
            isScrapped ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:text-red-400"
          )}
        >
          <Heart size={14} fill={isScrapped ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
    
    <div className="flex-1">
      <h3 className="text-[15px] font-black mb-1.5 text-gray-900 leading-snug tracking-tight break-keep">{policy.title}</h3>
      <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{policy.summary}</p>
    </div>

    <div className="flex justify-between items-center pt-3 border-t border-gray-50 mt-auto">
      <div className="flex items-center gap-1 text-red-500 font-black text-[11px]">
        <Clock size={12} />
        {policy.dDay}
      </div>
      <div className="text-primary text-[11px] font-black flex items-center gap-0.5">
        자세히 보기 <ChevronRight size={14} />
      </div>
    </div>
  </motion.div>
);

// --- MODALS ---

const MentoringModal = ({ onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-[2rem] p-7 shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-black flex items-center gap-2 tracking-tight"><Users className="text-primary" size={18}/> 멘토링 신청</h2>
        <button onClick={onClose} className="p-1.5 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200"><X size={16} /></button>
      </div>
      <p className="text-gray-500 text-[11px] font-bold mb-6 leading-relaxed">정책 전문가와 AI가 님의 상황에 맞는 최적의 신청 전략을 세워드립니다.</p>
      <div className="space-y-3">
        <button className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-primary/20 bg-blue-50/30 hover:bg-blue-50 transition-all text-left group" onClick={() => { alert('AI 멘토링 세션이 생성되었습니다.'); onClose(); }}>
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"><Bot size={20} /></div>
          <div><h3 className="font-black text-gray-900 text-[13px]">AI 실시간 멘토링</h3><p className="text-[10px] text-gray-400 font-bold">24시간 즉각적인 서류/절차 답변</p></div>
        </button>
        <button className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition-all text-left group" onClick={() => { alert('실무자 매칭이 요청되었습니다.'); onClose(); }}>
          <div className="w-10 h-10 bg-gray-800 text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"><User size={20} /></div>
          <div><h3 className="font-black text-gray-900 text-[13px]">실무자 1:1 상담</h3><p className="text-[10px] text-gray-400 font-bold">복잡한 케이스에 대한 심층 케어</p></div>
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
    alert('실제 신청이 접수되었습니다! 내 정보 탭에서 현황을 확인하세요.');
    onClose();
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <Activity size={32} className="text-primary animate-spin mb-4" />
        <h2 className="text-white text-lg font-black mb-1">알고리즘 모의 진단 중...</h2>
        <p className="text-white/50 text-[11px] font-bold">과거 합격 데이터와 님의 프로필을 정밀 대조하고 있습니다.</p>
      </motion.div>
    );
  }

  const isHighProb = policy.probability >= 80;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className={cn("p-7 text-center text-white", isHighProb ? "bg-primary" : "bg-orange-500")}>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            {isHighProb ? <Target size={24} /> : <AlertCircle size={24} />}
          </div>
          <h2 className="text-xl font-black mb-1">{isHighProb ? "합격 안정권입니다!" : "보완이 필요해 보여요"}</h2>
          <p className="text-[10px] font-bold opacity-80">{policy.title}</p>
        </div>
        <div className="p-7 space-y-5 bg-gray-50/50">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
            <p className="text-[10px] text-gray-400 font-black mb-1.5 uppercase tracking-widest">Expected Success Rate</p>
            <p className={cn("text-4xl font-black", isHighProb ? "text-primary" : "text-orange-500")}>{policy.probability}%</p>
          </div>
          
          {!isHighProb && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <h4 className="font-black text-orange-800 text-[11px] mb-1.5 flex items-center gap-1.5"><ShieldCheck size={14}/> 리바운드 케어 알림</h4>
              <p className="text-[10px] text-orange-700 font-medium leading-relaxed">소득 조건에서 약간의 차이가 발견되었습니다. 탈락 시 대체 가능한 정책 매칭 리스트를 생성했습니다.</p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-500 font-black rounded-xl text-xs hover:bg-gray-50 transition-all">닫기</button>
            <button onClick={handleRealApply} className="flex-[1.5] py-3.5 bg-gray-900 text-white font-black rounded-xl text-xs hover:bg-black transition-all shadow-lg">즉시 신청하기</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const EmailAlertModal = ({ policy, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-3xl p-7 shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="text-center">
        <div className="w-14 h-14 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <BellRing size={28} />
        </div>
        <h2 className="text-xl font-black mb-2">맞춤 알림 예약</h2>
        <p className="text-gray-500 text-sm mb-6 font-medium leading-relaxed">
          <span className="text-primary font-bold">[{policy.title}]</span><br/>
          공고가 뜨거나 마감이 임박하면<br/>이메일로 실시간 알림을 보내드릴까요?
        </p>
        <div className="space-y-3">
          <button className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all" onClick={() => { alert('알림 예약이 완료되었습니다!'); onClose(); }}>이메일 알림 받기</button>
          <button className="w-full py-3 text-gray-400 text-xs font-bold hover:text-gray-600 transition-all" onClick={onClose}>나중에 하기</button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const MainDetailModal = ({ 
  policy, onClose, isScrapped, onScrap, onOpenMock, onOpenMentoring, 
  issuedDocs, setIssuedDocs, onOpenAlert 
}) => {
  if (!policy) return null;
  
  const handleIssueAllDocs = () => {
    setIssuedDocs(prev => {
      const newDocs = new Set([...prev, ...policy.documents]);
      return Array.from(newDocs);
    });
    alert('필요한 서류가 모두 발급(연동)되어 서류함에 저장되었습니다.');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="relative bg-gray-900 p-7 flex-shrink-0 text-white">
          <div className="absolute top-5 right-6 flex gap-2">
            <button onClick={onOpenAlert} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10">
              <Bell size={18} />
            </button>
            <button onClick={() => onScrap(policy.id)} className={cn("p-2 rounded-full transition-colors", isScrapped ? "bg-red-500" : "bg-white/10 hover:bg-white/20 border border-white/10")}>
              <Heart size={18} fill={isScrapped ? "white" : "none"} />
            </button>
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10">
              <X size={18} />
            </button>
          </div>
          <div className="mt-2">
            <span className="text-[10px] font-black bg-primary px-2 py-1 rounded mb-2.5 inline-block tracking-tighter">[{policy.category}]</span>
            <h2 className="text-2xl font-black leading-tight tracking-tight">{policy.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 overflow-y-auto space-y-6 flex-1 bg-gray-50/30">
          
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onOpenMock} className="p-3.5 bg-white border border-primary/20 rounded-xl shadow-sm hover:border-primary transition-all flex flex-col items-center gap-1.5 text-primary">
              <Activity size={20} />
              <span className="text-xs font-black">모의 진단 분석</span>
            </button>
            <button onClick={onOpenMentoring} className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-400 transition-all flex flex-col items-center gap-1.5 text-gray-700">
              <Users size={20} />
              <span className="text-xs font-black">멘토링 신청</span>
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div><h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">지원 혜택</h4><p className="text-lg font-black text-gray-900">{policy.benefit}</p></div>
            <div className="text-right">
              <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">매칭 정확도</h4>
              <p className="text-lg font-black text-primary">{policy.probability}%</p>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-gray-400 mb-2.5 uppercase flex items-center gap-1.5"><Fingerprint size={14}/> 상세 자격 조건 및 연동 발급</h4>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed font-medium">{policy.details}</p>
              <div className="pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-[11px] font-black text-gray-800">연동 필요 서류 ({policy.documents.length})</h5>
                  <button onClick={handleIssueAllDocs} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1"><Download size={12}/> 원클릭 일괄 발급</button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {policy.documents.map((doc, i) => (
                    <div key={i} className={cn("flex items-center justify-between p-2.5 rounded-lg border text-[11px] font-bold transition-all", issuedDocs.includes(doc) ? "bg-green-50 border-green-100 text-green-700" : "bg-gray-50 border-gray-100 text-gray-400")}>
                      <span className="flex items-center gap-2"><FileText size={12}/> {doc}</span>
                      {issuedDocs.includes(doc) ? <CheckCircle2 size={12}/> : <span className="text-[9px] opacity-60">연동전</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-[12px] font-black text-gray-900 mb-3 flex items-center gap-1.5">
              <MessageCircle size={14} className="text-primary" />
              실제 합격자 찐 후기 & Q&A
            </h4>
            
            <div className="bg-white p-3.5 rounded-2xl border border-gray-100 mb-2">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded">합격</span>
                  <span className="text-[11px] font-bold text-gray-900">자취N년차</span>
                  <span className="text-[9px] text-gray-400">연소득 3,200 · 2일 전</span>
                </div>
                <button className="text-[9px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"><Heart size={10}/> 24</button>
              </div>
              <p className="text-[10px] text-gray-700 leading-relaxed font-medium">
                서류가 제일 막막했는데, 여기서 일괄 발급받고 바로 통과했습니다! 꿀팁: 은행 가실 때 꼭 오전에 가세요. 대기 엄청 깁니다 ㅠㅠ
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-gray-100 mb-3">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="bg-gray-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded">질문</span>
                  <span className="text-[11px] font-bold text-gray-900">둥지찾는새</span>
                  <span className="text-[9px] text-gray-400">프리랜서 · 5시간 전</span>
                </div>
                <button className="text-[9px] text-gray-400 hover:text-red-500 flex items-center gap-0.5"><Heart size={10}/> 5</button>
              </div>
              <p className="text-[10px] text-gray-700 leading-relaxed font-medium mb-2">
                프리랜서라서 소득 증빙이 헷갈리는데, 저 같은 분들 어떻게 준비하셨나요?
              </p>
              <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100 flex gap-1.5">
                <CornerDownRight size={10} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                   <span className="text-[9px] font-black text-primary">AI 멘토봇</span>
                   <p className="text-[9px] text-gray-600 mt-0.5 font-medium leading-relaxed">프리랜서의 경우 종합소득세 신고 내역서나 위촉증명서가 필요합니다. 상단의 '멘토링 신청'을 이용해 보세요!</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <input type="text" placeholder="질문이나 팁을 남겨보세요..." className="flex-1 bg-white border border-gray-200 text-[10px] px-3 py-2 rounded-xl outline-none focus:border-primary transition-all font-medium" />
              <button className="bg-gray-900 text-white px-3 py-2 rounded-xl text-[10px] font-black hover:bg-black transition-colors">등록</button>
            </div>
          </div>

        </div>

        <div className="p-5 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
          <button onClick={() => alert('전자서명 뷰어 호출(Demo)')} className="flex-1 py-3.5 bg-gray-100 text-gray-700 text-sm font-black rounded-xl hover:bg-gray-200 transition-all">전자서명 열람</button>
          <button onClick={onOpenMock} className="flex-[1.5] py-3.5 bg-primary text-white text-sm font-black rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20">신청 시작하기</button>
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
  
  const [savedPolicyIds, setSavedPolicyIds] = useState([]);
  const [issuedDocs, setIssuedDocs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showMockApply, setShowMockApply] = useState(false);
  const [showMentoring, setShowMentoring] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [filter, setFilter] = useState('전체');
  const [specialFilter, setSpecialFilter] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('nest-user');
      const savedScraps = localStorage.getItem('nest-scraps');
      const savedDocs = localStorage.getItem('nest-docs');
      const savedApps = localStorage.getItem('nest-apps');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
        setStep('dashboard');
      }
      if (savedScraps) setSavedPolicyIds(JSON.parse(savedScraps));
      if (savedDocs) setIssuedDocs(JSON.parse(savedDocs));
      if (savedApps) setApplications(JSON.parse(savedApps));
    } catch (e) { localStorage.clear(); }
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
      let score = 0;
      let tag = "확인필요";
      const incMatch = userIncome >= p.minIncome && userIncome <= p.maxIncome;
      const regMatch = p.regions.includes("전국") || userRegion.includes(p.regions[0]);
      const occMatch = p.occupations.includes(userOccupation);
      
      if (incMatch) score += 40;
      if (regMatch) score += 30;
      if (occMatch) score += 30;

      if (incMatch && regMatch && occMatch) tag = "자격충족";
      else if (incMatch || regMatch) tag = "확인필요";
      else tag = "부적격";

      score += (p.views / 10000) * 5;
      return { ...p, matchScore: Math.round(score), tag, 
        why: [
          incMatch ? "소득 충족" : "소득 초과",
          regMatch ? "거주지 일치" : "거주지 다름",
          occMatch ? "직업 일치" : "직업 미달"
        ]
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [user]);

  const filteredPolicies = useMemo(() => {
    let list = processedPolicies.filter(p => p.tag !== "부적격");
    if (filter !== '전체') list = list.filter(p => p.category === filter);
    if (specialFilter === '자격충족') list = list.filter(p => p.tag === '자격충족');
    else if (specialFilter === '마감임박') list = list.filter(p => p.dDay.includes('D-') && parseInt(p.dDay.replace('D-', '')) <= 7);
    return list;
  }, [processedPolicies, filter, specialFilter]);

  const totalBenefitAmount = useMemo(() => processedPolicies.filter(p => p.tag === "자격충족").reduce((acc, curr) => acc + curr.benefitAmount, 0), [processedPolicies]);
  const appliedPolicies = useMemo(() => applications.map(app => ({...processedPolicies.find(po => po.id === app.policyId), appStatus: app.status, applyDate: app.date})).filter(p => p.id), [applications, processedPolicies]);
  const savedPolicies = useMemo(() => processedPolicies.filter(p => savedPolicyIds.includes(p.id)), [processedPolicies, savedPolicyIds]);

  // Handlers
  const handleStart = (e) => { e.preventDefault(); localStorage.setItem('nest-user', JSON.stringify(user)); setStep('loading'); setTimeout(() => setStep('dashboard'), 2500); };
  const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); setStep('auth'); setOnboardingSubStep(1); setView('main'); };
  const toggleScrap = (id) => setSavedPolicyIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans tracking-tight">
      <AnimatePresence mode="wait">
        
        {step === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
              <div className="text-center mb-8"><div className="text-3xl mb-3">🐥</div><h1 className="text-2xl font-black text-gray-900 mb-1.5">둥지탈출</h1><p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Premium Housing Curation</p></div>
              <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setStep('onboarding'); }} className="space-y-5">
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
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                          {specialFilter ? (specialFilter === '자격충족' ? '✅ 자격 충족 리스트' : '⏰ 마감 직전 공고') : '🎯 오늘의 맞춤 추천'}
                          {specialFilter && <button onClick={() => setSpecialFilter(null)} className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full hover:text-primary transition-colors">전체보기</button>}
                        </h2>
                        <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0">{['전체', '대출지원', '월세지원', '공공임대'].map(cat => (<FilterButton key={cat} label={cat} active={filter === cat} onClick={() => setFilter(cat)} />))}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPolicies.map((p, i) => (<PolicyCard key={p.id} policy={p} onClick={() => setSelectedPolicy(p)} isScrapped={savedPolicyIds.includes(p.id)} onScrap={toggleScrap} isHighlyRecommended={i < 2 && !specialFilter && filter === '전체'} />))}
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
                            <div className="flex items-end gap-1"><span className="text-2xl font-black text-white">82.5</span><span className="text-[10px] text-gray-400 mb-1.5">/100</span></div>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">님의 소득과 거주지 조건을 분석한 결과, <span className="text-white font-bold">대출 지원</span> 분야에서 가장 높은 혜택이 예상됩니다.</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 space-y-8">
                      <section className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-black mb-5 flex items-center gap-2"><Activity size={18} className="text-primary"/> 실시간 심사 현황 트래커 (포트폴리오)</h2>
                        <div className="space-y-3">
                          {appliedPolicies.length > 0 ? appliedPolicies.map((app, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
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
                            {savedPolicies.slice(0, 3).map(p => (<div key={p.id} className="text-[11px] font-bold text-gray-600 truncate border-b border-gray-50 pb-2">{p.title}</div>))}
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
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{showAlert && selectedPolicy && <EmailAlertModal policy={selectedPolicy} onClose={() => setShowAlert(false)} />}</AnimatePresence>
      <AnimatePresence>{showMentoring && <MentoringModal onClose={() => setShowMentoring(false)} />}</AnimatePresence>
      <AnimatePresence>{showMockApply && selectedPolicy && (<MockApplyModal policy={selectedPolicy} onClose={() => setShowMockApply(false)} setApplications={setApplications} />)}</AnimatePresence>

    </div>
  );
}
