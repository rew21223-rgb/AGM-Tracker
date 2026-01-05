import React from 'react';
import { LucideIcon } from 'lucide-react';

export type SummaryCardColor = 
  | 'indigo' | 'emerald' | 'rose' | 'amber' 
  | 'violet' | 'fuchsia' | 'sky' | 'teal' 
  | 'orange' | 'blue' | 'cyan' | 'lime' 
  | 'pink' | 'purple' | 'yellow' | 'red' 
  | 'green' | 'slate' | 'zinc' | 'stone';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: SummaryCardColor;
  subtext?: string;
  trend?: {
    value: string;
    positive: boolean;
    neutral?: boolean;
  };
  onClick?: () => void;
  accessibilityLabel?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtext, 
  trend, 
  onClick,
  accessibilityLabel 
}) => {
  // Theme configuration with accessibility adjustments
  // Note: Lighter colors (Yellow, Amber, Orange, Lime, Cyan) use -700 for text to meet WCAG AA contrast (4.5:1)
  const themes: Record<SummaryCardColor, {
    text: string;
    border: string;
    accent: string;
    hover: string;
    iconBg: string;
    bgGradient: string;
    shadow: string;
    ring: string;
  }> = {
    indigo: { 
      text: 'text-indigo-600', border: 'border-indigo-100', accent: 'bg-indigo-500',
      hover: 'hover:border-indigo-300 hover:shadow-indigo-500/25', iconBg: 'bg-indigo-100/80',
      bgGradient: 'from-white to-indigo-50/40', shadow: 'shadow-indigo-500/10', ring: 'focus:ring-indigo-600'
    },
    emerald: { 
      text: 'text-emerald-600', border: 'border-emerald-100', accent: 'bg-emerald-500',
      hover: 'hover:border-emerald-300 hover:shadow-emerald-500/25', iconBg: 'bg-emerald-100/80',
      bgGradient: 'from-white to-emerald-50/40', shadow: 'shadow-emerald-500/10', ring: 'focus:ring-emerald-600'
    },
    rose: { 
      text: 'text-rose-600', border: 'border-rose-100', accent: 'bg-rose-500',
      hover: 'hover:border-rose-300 hover:shadow-rose-500/25', iconBg: 'bg-rose-100/80',
      bgGradient: 'from-white to-rose-50/40', shadow: 'shadow-rose-500/10', ring: 'focus:ring-rose-600'
    },
    amber: { 
      text: 'text-amber-700', border: 'border-amber-100', accent: 'bg-amber-500', // Adjusted to 700 for contrast
      hover: 'hover:border-amber-300 hover:shadow-amber-500/25', iconBg: 'bg-amber-100/80',
      bgGradient: 'from-white to-amber-50/40', shadow: 'shadow-amber-500/10', ring: 'focus:ring-amber-600'
    },
    violet: { 
      text: 'text-violet-600', border: 'border-violet-100', accent: 'bg-violet-500',
      hover: 'hover:border-violet-300 hover:shadow-violet-500/25', iconBg: 'bg-violet-100/80',
      bgGradient: 'from-white to-violet-50/40', shadow: 'shadow-violet-500/10', ring: 'focus:ring-violet-600'
    },
    fuchsia: { 
      text: 'text-fuchsia-600', border: 'border-fuchsia-100', accent: 'bg-fuchsia-500',
      hover: 'hover:border-fuchsia-300 hover:shadow-fuchsia-500/25', iconBg: 'bg-fuchsia-100/80',
      bgGradient: 'from-white to-fuchsia-50/40', shadow: 'shadow-fuchsia-500/10', ring: 'focus:ring-fuchsia-600'
    },
    sky: { 
      text: 'text-sky-700', border: 'border-sky-100', accent: 'bg-sky-500', // Adjusted to 700 for contrast stability
      hover: 'hover:border-sky-300 hover:shadow-sky-500/25', iconBg: 'bg-sky-100/80',
      bgGradient: 'from-white to-sky-50/40', shadow: 'shadow-sky-500/10', ring: 'focus:ring-sky-600'
    },
    teal: { 
      text: 'text-teal-600', border: 'border-teal-100', accent: 'bg-teal-500',
      hover: 'hover:border-teal-300 hover:shadow-teal-500/25', iconBg: 'bg-teal-100/80',
      bgGradient: 'from-white to-teal-50/40', shadow: 'shadow-teal-500/10', ring: 'focus:ring-teal-600'
    },
    orange: { 
      text: 'text-orange-700', border: 'border-orange-100', accent: 'bg-orange-500', // Adjusted to 700 for contrast
      hover: 'hover:border-orange-300 hover:shadow-orange-500/25', iconBg: 'bg-orange-100/80',
      bgGradient: 'from-white to-orange-50/40', shadow: 'shadow-orange-500/10', ring: 'focus:ring-orange-600'
    },
    blue: { 
      text: 'text-blue-600', border: 'border-blue-100', accent: 'bg-blue-500',
      hover: 'hover:border-blue-300 hover:shadow-blue-500/25', iconBg: 'bg-blue-100/80',
      bgGradient: 'from-white to-blue-50/40', shadow: 'shadow-blue-500/10', ring: 'focus:ring-blue-600'
    },
    cyan: { 
      text: 'text-cyan-700', border: 'border-cyan-100', accent: 'bg-cyan-500', // Adjusted to 700 for contrast
      hover: 'hover:border-cyan-300 hover:shadow-cyan-500/25', iconBg: 'bg-cyan-100/80',
      bgGradient: 'from-white to-cyan-50/40', shadow: 'shadow-cyan-500/10', ring: 'focus:ring-cyan-600'
    },
    lime: { 
      text: 'text-lime-700', border: 'border-lime-100', accent: 'bg-lime-500', // Adjusted to 700 for contrast
      hover: 'hover:border-lime-300 hover:shadow-lime-500/25', iconBg: 'bg-lime-100/80',
      bgGradient: 'from-white to-lime-50/40', shadow: 'shadow-lime-500/10', ring: 'focus:ring-lime-600'
    },
    pink: { 
      text: 'text-pink-600', border: 'border-pink-100', accent: 'bg-pink-500',
      hover: 'hover:border-pink-300 hover:shadow-pink-500/25', iconBg: 'bg-pink-100/80',
      bgGradient: 'from-white to-pink-50/40', shadow: 'shadow-pink-500/10', ring: 'focus:ring-pink-600'
    },
    purple: { 
      text: 'text-purple-600', border: 'border-purple-100', accent: 'bg-purple-500',
      hover: 'hover:border-purple-300 hover:shadow-purple-500/25', iconBg: 'bg-purple-100/80',
      bgGradient: 'from-white to-purple-50/40', shadow: 'shadow-purple-500/10', ring: 'focus:ring-purple-600'
    },
    yellow: { 
      text: 'text-yellow-700', border: 'border-yellow-100', accent: 'bg-yellow-500', // Adjusted to 700 for contrast
      hover: 'hover:border-yellow-300 hover:shadow-yellow-500/25', iconBg: 'bg-yellow-100/80',
      bgGradient: 'from-white to-yellow-50/40', shadow: 'shadow-yellow-500/10', ring: 'focus:ring-yellow-600'
    },
    red: { 
      text: 'text-red-600', border: 'border-red-100', accent: 'bg-red-500',
      hover: 'hover:border-red-300 hover:shadow-red-500/25', iconBg: 'bg-red-100/80',
      bgGradient: 'from-white to-red-50/40', shadow: 'shadow-red-500/10', ring: 'focus:ring-red-600'
    },
    green: { 
      text: 'text-green-600', border: 'border-green-100', accent: 'bg-green-500',
      hover: 'hover:border-green-300 hover:shadow-green-500/25', iconBg: 'bg-green-100/80',
      bgGradient: 'from-white to-green-50/40', shadow: 'shadow-green-500/10', ring: 'focus:ring-green-600'
    },
    slate: { 
      text: 'text-slate-600', border: 'border-slate-200', accent: 'bg-slate-500',
      hover: 'hover:border-slate-400 hover:shadow-slate-500/25', iconBg: 'bg-slate-100/80',
      bgGradient: 'from-white to-slate-50/40', shadow: 'shadow-slate-500/10', ring: 'focus:ring-slate-500'
    },
    zinc: { 
      text: 'text-zinc-600', border: 'border-zinc-200', accent: 'bg-zinc-500',
      hover: 'hover:border-zinc-400 hover:shadow-zinc-500/25', iconBg: 'bg-zinc-100/80',
      bgGradient: 'from-white to-zinc-50/40', shadow: 'shadow-zinc-500/10', ring: 'focus:ring-zinc-500'
    },
    stone: { 
      text: 'text-stone-600', border: 'border-stone-200', accent: 'bg-stone-500',
      hover: 'hover:border-stone-400 hover:shadow-stone-500/25', iconBg: 'bg-stone-100/80',
      bgGradient: 'from-white to-stone-50/40', shadow: 'shadow-stone-500/10', ring: 'focus:ring-stone-500'
    }
  };

  const currentTheme = themes[color] || themes.indigo;

  // Semantic Element Selection: Use <button> if interactive, otherwise <article>
  const Component = onClick ? 'button' : 'article';
  
  // Interactive state determination
  const isInteractive = !!onClick;

  return (
    <Component 
      className={`
        relative text-left w-full
        bg-gradient-to-br ${currentTheme.bgGradient} 
        rounded-2xl p-6 border-2 
        transition-all duration-300 ease-out overflow-hidden 
        flex flex-col justify-between h-full 
        ${currentTheme.border} ${currentTheme.shadow} 
        ${isInteractive 
          ? `cursor-pointer active:scale-[0.98] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.ring} group` 
          : 'cursor-default'
        }
      `}
      onClick={onClick}
      type={isInteractive ? "button" : undefined}
      // If interactive, the button needs the label. If static, the article label helps navigation modes.
      aria-label={accessibilityLabel || `${title}: ${value}${subtext ? `. ${subtext}` : ''}`}
    >
      {/* Decorative Top Accent - Hidden from screen readers */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${currentTheme.accent} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} aria-hidden="true" />
      
      {/* Decorative Radial Background Accent - Hidden from screen readers */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${currentTheme.accent} opacity-5 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} aria-hidden="true" />

      <div className="flex justify-between items-start mb-6 relative z-10 w-full">
        <div className={`p-3.5 rounded-2xl shadow-inner border border-white/50 ${currentTheme.iconBg} ${currentTheme.text} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`} aria-hidden="true">
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {trend && (
           <span 
             className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border shadow-sm transition-colors duration-500 ${
               trend.neutral ? 'bg-slate-50 text-slate-500 border-slate-100' : 
               trend.positive ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-100'
             }`}
             aria-label={`Trend: ${trend.value}`}
           >
             {trend.value}
           </span>
         )}
      </div>

      <div className="relative z-10 w-full">
        <h3 className={`text-4xl font-black ${currentTheme.text} tracking-tight tabular-nums transition-colors duration-500`}>
          {value}
        </h3>
        <p className="text-xs font-black text-slate-600 uppercase tracking-[0.15em] mt-2 group-hover:text-slate-800 transition-colors">
          {title}
        </p>
        
        {subtext && (
          <div className="mt-4 pt-4 border-t border-slate-100/60 w-full">
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic group-hover:text-slate-800 transition-colors">
              {subtext}
            </p>
          </div>
        )}
      </div>
    </Component>
  );
};

export default SummaryCard;