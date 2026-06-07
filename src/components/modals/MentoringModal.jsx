import { motion } from 'framer-motion';
import { Users, X, Bot, User } from 'lucide-react';

export const MentoringModal = ({ onClose, onOpenAI }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-sm rounded-[2rem] p-7 shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-black flex items-center gap-2 tracking-tight"><Users className="text-primary" size={18}/> 멘토링 신청</h2>
        <button onClick={onClose} className="p-1.5 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200"><X size={16} /></button>
      </div>
      <p className="text-gray-500 text-[11px] font-bold mb-6 leading-relaxed">정책 전문가와 AI가 님의 상황에 맞는 최적의 신청 전략을 세워드립니다.</p>
      <div className="space-y-3">
        <button className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-primary/20 bg-blue-50/30 hover:bg-blue-50 transition-all text-left group" onClick={() => { onOpenAI(); onClose(); }}>
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
