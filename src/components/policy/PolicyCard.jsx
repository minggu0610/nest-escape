import { motion } from 'framer-motion';
import { Heart, Target, Clock, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const PolicyCard = ({ policy, onClick, isScrapped, onScrap, isHighlyRecommended }) => (
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
