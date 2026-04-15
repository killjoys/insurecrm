import { useState } from 'react';
import type { DashboardView } from '../types';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import OperationsView from './dashboard/OperationsView';
import BusinessView from './dashboard/BusinessView';
import PipelineView from './dashboard/PipelineView';

const views: { key: DashboardView; labelKey: string }[] = [
  { key: 'operations', labelKey: 'dashboard.operations' },
  { key: 'business', labelKey: 'dashboard.business' },
  { key: 'pipeline', labelKey: 'dashboard.pipeline' },
];

export default function Dashboard() {
  const { lang } = useApp();
  const [activeView, setActiveView] = useState<DashboardView>('operations');

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setActiveView(v.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === v.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t(v.labelKey, lang)}
          </button>
        ))}
      </div>

      {/* Views */}
      {activeView === 'operations' && <OperationsView />}
      {activeView === 'business' && <BusinessView />}
      {activeView === 'pipeline' && <PipelineView />}
    </div>
  );
}
