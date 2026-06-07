import { cn } from '../../utils/cn';

export const FilterButton = ({ label, active, onClick }) => (
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
