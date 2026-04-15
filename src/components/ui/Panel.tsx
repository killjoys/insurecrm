import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Panel({ title, action, children, className = '' }: PanelProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
