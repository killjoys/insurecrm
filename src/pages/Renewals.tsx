import { useState } from 'react';
import { Search, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, formatDate } from '../i18n';
import StatusBadge from '../components/ui/StatusBadge';

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

type UrgencyFilter = 'all' | 'overdue' | '7days' | '14days' | '30days';

export default function RenewalsPage() {
  const { lang, policies } = useApp();
  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('all');

  const inforcedPolicies = policies.filter((p) => p.status === 'Inforced');

  const enriched = inforcedPolicies.map((p) => ({
    ...p,
    daysLeft: getDaysUntil(p.renewalDate),
  })).sort((a, b) => a.daysLeft - b.daysLeft);

  const filtered = enriched.filter((p) => {
    const matchSearch =
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.policyNumber.toLowerCase().includes(search.toLowerCase());

    let matchUrgency = true;
    switch (urgencyFilter) {
      case 'overdue': matchUrgency = p.daysLeft < 0; break;
      case '7days': matchUrgency = p.daysLeft >= 0 && p.daysLeft <= 7; break;
      case '14days': matchUrgency = p.daysLeft >= 0 && p.daysLeft <= 14; break;
      case '30days': matchUrgency = p.daysLeft >= 0 && p.daysLeft <= 30; break;
    }

    return matchSearch && matchUrgency;
  });

  const getRowColor = (days: number) => {
    if (days < 0) return 'bg-red-50';
    if (days <= 7) return 'bg-red-50';
    if (days <= 14) return 'bg-amber-50';
    if (days <= 30) return 'bg-blue-50';
    return '';
  };

  const getDaysBadge = (days: number) => {
    if (days < 0) return { label: `เกิน ${Math.abs(days)} วัน`, variant: 'red' as const };
    if (days <= 7) return { label: `${days} วัน`, variant: 'red' as const };
    if (days <= 14) return { label: `${days} วัน`, variant: 'yellow' as const };
    if (days <= 30) return { label: `${days} วัน`, variant: 'blue' as const };
    return { label: `${days} วัน`, variant: 'green' as const };
  };

  const counts = {
    all: enriched.length,
    overdue: enriched.filter((p) => p.daysLeft < 0).length,
    seven: enriched.filter((p) => p.daysLeft >= 0 && p.daysLeft <= 7).length,
    fourteen: enriched.filter((p) => p.daysLeft >= 0 && p.daysLeft <= 14).length,
    thirty: enriched.filter((p) => p.daysLeft >= 0 && p.daysLeft <= 30).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.renewals', lang)}</h1>
        <p className="text-sm text-gray-500 mt-1">ติดตามการต่ออายุกรมธรรม์</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setUrgencyFilter('overdue')}
          className={`rounded-xl border p-4 text-left transition-all ${urgencyFilter === 'overdue' ? 'border-red-400 bg-red-50 ring-2 ring-red-200' : 'border-gray-200 bg-white hover:border-red-300'}`}
        >
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">เกินกำหนด</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{counts.overdue}</p>
        </button>
        <button
          onClick={() => setUrgencyFilter('7days')}
          className={`rounded-xl border p-4 text-left transition-all ${urgencyFilter === '7days' ? 'border-red-400 bg-red-50 ring-2 ring-red-200' : 'border-gray-200 bg-white hover:border-red-300'}`}
        >
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">≤ 7 วัน</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{counts.seven}</p>
        </button>
        <button
          onClick={() => setUrgencyFilter('14days')}
          className={`rounded-xl border p-4 text-left transition-all ${urgencyFilter === '14days' ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200' : 'border-gray-200 bg-white hover:border-amber-300'}`}
        >
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">≤ 14 วัน</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">{counts.fourteen}</p>
        </button>
        <button
          onClick={() => setUrgencyFilter('30days')}
          className={`rounded-xl border p-4 text-left transition-all ${urgencyFilter === '30days' ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-300'}`}
        >
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">≤ 30 วัน</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{counts.thirty}</p>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" placeholder={t('common.search', lang)} value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
        {urgencyFilter !== 'all' && (
          <button
            onClick={() => setUrgencyFilter('all')}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            แสดงทั้งหมด ({counts.all})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <th className="px-5 py-3 font-medium">{t('table.policyNumber', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.client', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.category', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.provider', lang)}</th>
                <th className="px-5 py-3 font-medium text-right">{t('table.premium', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.renewalDate', lang)}</th>
                <th className="px-5 py-3 font-medium text-center">{t('table.daysLeft', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((policy) => {
                const badge = getDaysBadge(policy.daysLeft);
                return (
                  <tr key={policy.id} className={`${getRowColor(policy.daysLeft)} transition-colors`}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{policy.policyNumber}</p>
                      <p className="text-xs text-gray-500">{policy.planName}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{policy.clientName}</td>
                    <td className="px-5 py-3 text-gray-600">{t(`category.${policy.category}`, lang)}</td>
                    <td className="px-5 py-3 text-gray-600">{policy.provider}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">{policy.premium.toLocaleString('th-TH')}</td>
                    <td className="px-5 py-3 text-gray-600">{formatDate(policy.renewalDate)}</td>
                    <td className="px-5 py-3 text-center">
                      <StatusBadge label={badge.label} variant={badge.variant} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">{t('common.noData', lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
