import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, Calculator, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t, formatCurrency } from '../../i18n';
import KpiCard from '../../components/ui/KpiCard';
import Panel from '../../components/ui/Panel';
import { monthlyRevenue } from '../../data/seed';

export default function BusinessView() {
  const { lang, policies } = useApp();

  const inforcedPolicies = policies.filter((p) => p.status === 'Inforced');

  // Calculate annualized premium
  const annualizedPremium = inforcedPolicies.reduce((sum, p) => {
    let annual = p.premium;
    switch (p.premiumFrequency) {
      case 'Monthly': annual = p.premium * 12; break;
      case 'Quarterly': annual = p.premium * 4; break;
      case 'Semi-Annual': annual = p.premium * 2; break;
      default: annual = p.premium;
    }
    return sum + annual;
  }, 0);

  const revenueYTD = monthlyRevenue.reduce((s, m) => s + m.life + m.nonLife + m.bonus, 0);
  const bonusYTD = monthlyRevenue.reduce((s, m) => s + m.bonus, 0);
  const netProfitYTD = Math.round(revenueYTD * 0.35);

  // Top policies by premium
  const topPolicies = [...inforcedPolicies]
    .sort((a, b) => {
      const aAnnual = a.premiumFrequency === 'Monthly' ? a.premium * 12 : a.premiumFrequency === 'Quarterly' ? a.premium * 4 : a.premiumFrequency === 'Semi-Annual' ? a.premium * 2 : a.premium;
      const bAnnual = b.premiumFrequency === 'Monthly' ? b.premium * 12 : b.premiumFrequency === 'Quarterly' ? b.premium * 4 : b.premiumFrequency === 'Semi-Annual' ? b.premium * 2 : b.premium;
      return bAnnual - aAnnual;
    })
    .slice(0, 5);

  // Top clients by total premium
  const clientPremiums = new Map<string, { name: string; total: number; count: number }>();
  inforcedPolicies.forEach((p) => {
    const annual = p.premiumFrequency === 'Monthly' ? p.premium * 12 : p.premiumFrequency === 'Quarterly' ? p.premium * 4 : p.premiumFrequency === 'Semi-Annual' ? p.premium * 2 : p.premium;
    const existing = clientPremiums.get(p.clientId);
    if (existing) {
      existing.total += annual;
      existing.count += 1;
    } else {
      clientPremiums.set(p.clientId, { name: p.clientName, total: annual, count: 1 });
    }
  });
  const topClients = [...clientPremiums.values()].sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t('kpi.revenueYTD', lang)}
          value={formatCurrency(revenueYTD, lang)}
          icon={<DollarSign className="h-5 w-5" />}
          color="bg-emerald-50 text-emerald-600"
          trend={{ value: '+12% YoY', positive: true }}
        />
        <KpiCard
          title={t('kpi.netProfitYTD', lang)}
          value={formatCurrency(netProfitYTD, lang)}
          icon={<TrendingUp className="h-5 w-5" />}
          color="bg-blue-50 text-blue-600"
          trend={{ value: '+8% YoY', positive: true }}
        />
        <KpiCard
          title={t('kpi.annualizedPremium', lang)}
          value={formatCurrency(annualizedPremium, lang)}
          icon={<Calculator className="h-5 w-5" />}
          color="bg-purple-50 text-purple-600"
        />
        <KpiCard
          title={t('kpi.bonusOV', lang)}
          value={formatCurrency(bonusYTD, lang)}
          icon={<Gift className="h-5 w-5" />}
          color="bg-amber-50 text-amber-600"
          trend={{ value: '+18% YoY', positive: true }}
        />
      </div>

      {/* Monthly Revenue Chart */}
      <Panel title={t('panel.monthlyRevenue', lang)}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => (value as number).toLocaleString('th-TH') + ' บาท'}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend />
              <Bar dataKey="life" name={t('chart.life', lang)} fill="#6366f1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="nonLife" name={t('chart.nonLife', lang)} fill="#06b6d4" radius={[2, 2, 0, 0]} />
              <Bar dataKey="bonus" name={t('chart.bonus', lang)} fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Policies */}
        <Panel title={t('panel.topPolicies', lang)}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-3 font-medium">กรมธรรม์</th>
                  <th className="pb-3 font-medium">ประเภท</th>
                  <th className="pb-3 font-medium text-right">เบี้ยรายปี</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPolicies.map((p) => {
                  const annual = p.premiumFrequency === 'Monthly' ? p.premium * 12 : p.premiumFrequency === 'Quarterly' ? p.premium * 4 : p.premiumFrequency === 'Semi-Annual' ? p.premium * 2 : p.premium;
                  return (
                    <tr key={p.id}>
                      <td className="py-2.5">
                        <p className="font-medium text-gray-900">{p.planName}</p>
                        <p className="text-xs text-gray-500">{p.clientName}</p>
                      </td>
                      <td className="py-2.5 text-gray-600">{p.category}</td>
                      <td className="py-2.5 text-right font-medium text-gray-900">
                        {annual.toLocaleString('th-TH')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Top Clients */}
        <Panel title={t('panel.topClients', lang)}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-3 font-medium">ลูกค้า</th>
                  <th className="pb-3 font-medium text-center">กรมธรรม์</th>
                  <th className="pb-3 font-medium text-right">เบี้ยรายปีรวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topClients.map((c, i) => (
                  <tr key={i}>
                    <td className="py-2.5 font-medium text-gray-900">{c.name}</td>
                    <td className="py-2.5 text-center text-gray-600">{c.count}</td>
                    <td className="py-2.5 text-right font-medium text-gray-900">
                      {c.total.toLocaleString('th-TH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
