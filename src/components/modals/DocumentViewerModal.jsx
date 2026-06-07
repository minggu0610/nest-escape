import { motion } from 'framer-motion';
import { X, FileText, Download, Printer } from 'lucide-react';

export const DocumentViewerModal = ({ docName, userData, onClose }) => {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.9, y: 20 }} 
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-gray-500" />
            <span className="text-sm font-black text-gray-700">{docName} - 미리보기</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"><Download size={18}/></button>
            <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"><Printer size={18}/></button>
            <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-gray-600 transition-colors ml-2"><X size={18}/></button>
          </div>
        </div>

        {/* Paper Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-gray-200 flex justify-center">
          <div className="w-[595px] min-h-[842px] bg-white shadow-xl p-16 relative flex flex-col text-gray-900 font-serif">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-45 text-8xl font-black">
              NEST ESCAPE
            </div>

            {/* Document Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-black underline underline-offset-8 decoration-2 mb-2">{docName}</h1>
              <p className="text-xs text-gray-400">제 2026-NEST-{Math.floor(Math.random() * 10000)}호</p>
            </div>

            {/* Information Grid */}
            <div className="border-2 border-gray-900 mb-8">
              <div className="grid grid-cols-4 border-b-2 border-gray-900">
                <div className="bg-gray-100 p-3 border-r-2 border-gray-900 font-bold text-center text-sm">성 명</div>
                <div className="p-3 border-r-2 border-gray-900 text-sm">{userData.name || '홍길동'}</div>
                <div className="bg-gray-100 p-3 border-r-2 border-gray-900 font-bold text-center text-sm">생년월일</div>
                <div className="p-3 text-sm">{userData.birthdate || '1995-01-01'}</div>
              </div>
              <div className="grid grid-cols-4 border-b-2 border-gray-900">
                <div className="bg-gray-100 p-3 border-r-2 border-gray-900 font-bold text-center text-sm">주 소</div>
                <div className="p-3 col-span-3 text-sm">{userData.region || '서울특별시'} (상세주소 생략)</div>
              </div>
              <div className="grid grid-cols-4">
                <div className="bg-gray-100 p-3 border-r-2 border-gray-900 font-bold text-center text-sm">용 도</div>
                <div className="p-3 col-span-3 text-sm">주거 정책 지원 및 자격 증빙용</div>
              </div>
            </div>

            {/* Detailed Content based on docName */}
            <div className="flex-1 space-y-6 pt-8">
              <p className="text-sm leading-loose">
                위 사람은 대한민국 정부 및 지자체에서 시행하는 주거 지원 사업의 신청 자격을 갖추었음을 증명하기 위하여 
                본 서류를 신청하였으며, 입력된 정보(<span className="font-bold">연소득 {parseInt(userData.income).toLocaleString()}만원, 자산 {parseInt(userData.assets).toLocaleString()}만원</span>)를 
                바탕으로 본 증명서를 발급합니다.
              </p>
              
              <div className="pt-10 space-y-4">
                <h3 className="font-bold text-lg">■ 증명 사항</h3>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li>현재 무주택 상태 여부: 확인됨 ({userData.homelessPeriod}년 경과)</li>
                  <li>직업군 분류: {userData.occupation}</li>
                  <li>혼인 여부: {userData.maritalStatus}</li>
                  <li>소득 적합성: 정책 기준 부합</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 text-center space-y-8">
              <div className="text-xl font-black">
                {today}
              </div>
              <div className="flex flex-col items-center">
                <p className="text-2xl font-black tracking-[0.5em] mb-4">둥지탈출 커뮤니티 장</p>
                <div className="w-16 h-16 border-2 border-red-600 rounded-full flex items-center justify-center text-red-600 font-black text-xs rotate-12">
                  (인)
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
