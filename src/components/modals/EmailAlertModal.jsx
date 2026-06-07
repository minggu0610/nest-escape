import { motion } from 'framer-motion';
import { BellRing } from 'lucide-react';

export const EmailAlertModal = ({ policy, onClose }) => (
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
