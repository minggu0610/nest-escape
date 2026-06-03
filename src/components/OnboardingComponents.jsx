import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const SelectionCard = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-4 py-3 rounded-xl border text-sm font-bold transition-all text-center",
      selected 
        ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
        : "bg-white text-gray-500 border-gray-100 hover:border-primary/30"
    )}
  >
    {label}
  </button>
);
