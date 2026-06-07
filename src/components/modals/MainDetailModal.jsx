import { motion } from 'framer-motion';
import { 
  Bell, Heart, X, Activity, Users, Fingerprint, 
  Download, FileText, CheckCircle2, MessageCircle, 
  CornerDownRight, Share2, BarChart3 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import { cn } from '../../utils/cn';

export const MainDetailModal = ({ 
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

  const openOriginalNotice = () => {
    if (policy.originalUrl) {
      window.open(policy.originalUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('상세 공고 링크가 제공되지 않는 정책입니다.');
    }
  };

  // Chart Data mapping
  const chartData = [
    { subject: '소득', A: policy.why?.[0]?.includes('충족') ? 100 : 30, fullMark: 100 },
    { subject: '거주지', A: policy.why?.[1]?.includes('일치') ? 100 : 40, fullMark: 100 },
    { subject: '직업', A: policy.why?.[2]?.includes('일치') ? 100 : 50, fullMark: 100 },
    { subject: '자산', A: 85, fullMark: 100 },
    { subject: '무주택', A: 90, fullMark: 100 },
  ];

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

          {/* Visual Analysis Chart */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-black text-gray-400 uppercase mb-4 flex items-center gap-1.5"><BarChart3 size={14}/> 매칭 지수 상세 분석</h4>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full h-48 md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#f3f4f6" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                    <Radar
                      name="Match"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3 w-full">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Overall Probability</p>
                  <div className="flex items-end gap-1.5">
                    <span className="text-3xl font-black text-primary">{policy.probability}%</span>
                    <span className="text-[10px] font-black text-green-500 mb-1.5">Very High</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-white border border-gray-100 rounded-xl">
                    <p className="text-[9px] text-gray-400 font-bold mb-1">지원 혜택</p>
                    <p className="text-xs font-black text-gray-800">{policy.benefit}</p>
                  </div>
                  <div className="p-3 bg-white border border-gray-100 rounded-xl">
                    <p className="text-[9px] text-gray-400 font-bold mb-1">예상 가치</p>
                    <p className="text-xs font-black text-primary">{policy.benefitAmount?.toLocaleString()}만원</p>
                  </div>
                </div>
              </div>
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
                   <p className="text-[9px] text-gray-600 mt-0.5 font-medium leading-relaxed">프리랜서의 경우 종합소득세 신고 내역서나 위촉증명서가 필요합니다. 상단의 &apos;멘토링 신청&apos;을 이용해 보세요!</p>
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
          <button onClick={openOriginalNotice} className="flex-1 py-3.5 bg-gray-100 text-gray-700 text-sm font-black rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
            <Share2 size={16} /> 원문 공고 보기
          </button>
          <button onClick={onOpenMock} className="flex-[1.5] py-3.5 bg-primary text-white text-sm font-black rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20">신청 시작하기</button>
        </div>
      </motion.div>
    </motion.div>
  );
};
