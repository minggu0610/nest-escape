export const InputField = ({ label, icon: Icon, type = "text", ...props }) => (
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
