import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, AlertCircle, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export const MockApplyModal = ({ policy, onClose, setApplications }) => {
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
