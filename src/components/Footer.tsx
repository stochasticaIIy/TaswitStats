import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-[#070b12] py-8 px-4 text-slate-400 text-xs text-center">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white font-['Alexandria']">إحصائيات انتخابات المغرب 2026</span>
          <span aria-hidden="true">·</span>
          <span>منصة مستقلة لتحليل البيانات الانتخابية بالدارجة المغربية</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>البيانات مستندة للمحاضر الرسمية لوزارة الداخلية ومجلس النواب</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">2026 - 2031</span>
        </div>
      </div>
    </footer>
  );
};
