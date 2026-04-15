import { useApp } from '../../context/AppContext';
import { t } from '../../i18n';
import Panel from '../../components/ui/Panel';
import StatusBadge, { getLeadStageVariant } from '../../components/ui/StatusBadge';
import { ArrowRight } from 'lucide-react';

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const funnelStages = ['New', 'Contacted', 'Quoted', 'Closed'] as const;
const funnelColors = ['bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-emerald-500'];

export default function PipelineView() {
  const { lang, leads, clients, policies } = useApp();

  const stageCounts = funnelStages.map((s) => leads.filter((l) => l.stage === s).length);
  const maxCount = Math.max(...stageCounts, 1);

  const vipCount = clients.filter((c) => c.tier === 'VIP').length;
  const standardCount = clients.filter((c) => c.tier === 'Standard').length;

  const inforcedPolicies = policies.filter((p) => p.status === 'Inforced');
  const renewalBuckets = { overdue: 0, critical: 0, warning: 0, healthy: 0 };
  inforcedPolicies.forEach((p) => {
    const days = getDaysUntil(p.renewalDate);
    if (days < 0) renewalBuckets.overdue++;
    else if (days <= 7) renewalBuckets.critical++;
    else if (days <= 30) renewalBuckets.warning++;
    else renewalBuckets.healthy++;
  });

  return (
    <div className="space-y-6">
      {/* Lead Funnel */}
      <Panel title={t('panel.leadFunnel', lang)}>
        <div className="space-y-4">
          {/* Funnel visualization */}
          <div className="flex items-end gap-3 h-48">
            {funnelStages.map((stage, i) => {
              const count = stageCounts[i];
              const height = Math.max((count / maxCount) * 100, 10);
              return (
                <div key={stage} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">{count}</span>
                  <div className="w-full relative" style={{ height: `${height}%` }}>
                    <div className={`w-full h-full rounded-t-lg ${funnelColors[i]} opacity-80`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge label={t(`stage.${stage}`, lang)} variant={getLeadStageVariant(stage)} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conversion flow */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            {funnelStages.map((stage, i) => (
              <span key={stage} className="flex items-center gap-2">
                <span className="font-medium">{t(`stage.${stage}`, lang)}</span>
                {i < funnelStages.length - 1 && <ArrowRight className="h-4 w-4 text-gray-300" />}
              </span>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Client Tier Distribution */}
        <Panel title={t('panel.clientTiers', lang)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">VIP</span>
                  <span className="text-sm font-bold text-amber-600">{vipCount}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${(vipCount / (vipCount + standardCount)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Standard</span>
                  <span className="text-sm font-bold text-blue-600">{standardCount}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(standardCount / (vipCount + standardCount)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">รวมทั้งหมด</span>
                <span className="font-bold text-gray-900">{vipCount + standardCount} ราย</span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Renewal Health */}
        <Panel title={t('panel.renewalHealth', lang)}>
          <div className="space-y-3">
            {[
              { label: 'เกินกำหนด', count: renewalBuckets.overdue, color: 'bg-red-500', textColor: 'text-red-700' },
              { label: 'เร่งด่วน (≤7 วัน)', count: renewalBuckets.critical, color: 'bg-amber-500', textColor: 'text-amber-700' },
              { label: 'ใกล้ถึง (8-30 วัน)', count: renewalBuckets.warning, color: 'bg-blue-500', textColor: 'text-blue-700' },
              { label: 'ปกติ (>30 วัน)', count: renewalBuckets.healthy, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
            ].map((bucket) => (
              <div key={bucket.label} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${bucket.color} shrink-0`} />
                <span className="text-sm text-gray-600 flex-1">{bucket.label}</span>
                <span className={`text-sm font-bold ${bucket.textColor}`}>{bucket.count}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">กรมธรรม์ Inforced ทั้งหมด</span>
                <span className="font-bold text-gray-900">{inforcedPolicies.length} ฉบับ</span>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
