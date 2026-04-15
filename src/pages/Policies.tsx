import { useState } from 'react';
import { FilePlus, Search, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, formatDate, formatCurrency } from '../i18n';
import StatusBadge, { getPolicyStatusVariant } from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import type { Policy, PolicyCategory, PolicyStatus, LifeSubtype, PremiumFrequency } from '../types';
import { policiesApi } from '../api/policiesApi';

const categories: PolicyCategory[] = ['Life', 'Health', 'PA', 'Motor', 'Fire', 'Other'];
const lifeSubtypes: LifeSubtype[] = ['Whole Life', 'Endowment', 'Annuity', 'Unit-Linked', 'Universal Life', 'Term'];
const statuses: PolicyStatus[] = ['Pending', 'Inforced', 'Lapsed', 'Cancelled', 'Matured'];
const allFrequencies: PremiumFrequency[] = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];

interface PolicyForm {
  clientId: string;
  policyNumber: string;
  category: PolicyCategory;
  lifeSubtype: LifeSubtype | '';
  provider: string;
  planName: string;
  premium: string;
  premiumFrequency: PremiumFrequency;
  sumInsured: string;
  status: PolicyStatus;
  effectiveDate: string;
  renewalDate: string;
  maturityDate: string;
  notes: string;
}

function emptyForm(): PolicyForm {
  return {
    clientId: '', policyNumber: '', category: 'Life', lifeSubtype: 'Whole Life',
    provider: '', planName: '', premium: '', premiumFrequency: 'Annual',
    sumInsured: '', status: 'Pending', effectiveDate: '', renewalDate: '',
    maturityDate: '', notes: '',
  };
}

export default function PoliciesPage() {
  const { lang, policies, setPolicies, clients } = useApp();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<PolicyCategory | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<PolicyStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Policy | null>(null);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [form, setForm] = useState<PolicyForm>(emptyForm());

  const filtered = policies.filter((p) => {
    const matchSearch =
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.policyNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.planName.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const isLife = form.category === 'Life';

  // Business rules: Non-life = Annual only
  const availableFrequencies = isLife ? allFrequencies : (['Annual'] as PremiumFrequency[]);

  const openCreate = () => {
    setEditingPolicy(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setForm({
      clientId: policy.clientId, policyNumber: policy.policyNumber, category: policy.category,
      lifeSubtype: policy.lifeSubtype ?? '', provider: policy.provider, planName: policy.planName,
      premium: String(policy.premium), premiumFrequency: policy.premiumFrequency,
      sumInsured: String(policy.sumInsured), status: policy.status, effectiveDate: policy.effectiveDate,
      renewalDate: policy.renewalDate, maturityDate: policy.maturityDate ?? '', notes: policy.notes,
    });
    setShowModal(true);
  };

  // Validate form
  const isValid = () => {
    if (!form.clientId || !form.policyNumber || !form.provider || !form.planName || !form.premium || !form.renewalDate || !form.effectiveDate) return false;
    // Life requires maturityDate and lifeSubtype
    if (form.category === 'Life' && (!form.maturityDate || !form.lifeSubtype)) return false;
    return true;
  };

  const handleCategoryChange = (cat: PolicyCategory) => {
    setForm((prev) => ({
      ...prev,
      category: cat,
      // Reset life fields if switching away from Life
      lifeSubtype: cat === 'Life' ? (prev.lifeSubtype || 'Whole Life') : '',
      maturityDate: cat === 'Life' ? prev.maturityDate : '',
      // Non-life must be Annual
      premiumFrequency: cat !== 'Life' ? 'Annual' : prev.premiumFrequency,
    }));
  };

  const handleSave = async () => {
    if (!isValid()) return;
    const clientName = clients.find((c) => c.id === form.clientId)?.name ?? '';
    const policyData: Omit<Policy, 'id'> = {
      clientId: form.clientId,
      clientName,
      policyNumber: form.policyNumber,
      category: form.category,
      lifeSubtype: form.category === 'Life' ? (form.lifeSubtype as LifeSubtype) : undefined,
      provider: form.provider,
      planName: form.planName,
      premium: Number(form.premium),
      premiumFrequency: form.premiumFrequency,
      sumInsured: Number(form.sumInsured),
      status: form.status,
      effectiveDate: form.effectiveDate,
      renewalDate: form.renewalDate,
      maturityDate: form.category === 'Life' ? form.maturityDate : undefined,
      notes: form.notes,
    };

    try {
      if (editingPolicy) {
        try {
          const updated = await policiesApi.update(editingPolicy.id, policyData);
          setPolicies((prev) => prev.map((p) => p.id === editingPolicy.id ? updated : p));
        } catch {
          setPolicies((prev) => prev.map((p) => p.id === editingPolicy.id ? { ...p, ...policyData } : p));
        }
      } else {
        try {
          const created = await policiesApi.create(policyData);
          setPolicies((prev) => [created, ...prev]);
        } catch {
          setPolicies((prev) => [{ id: `p${Date.now()}`, ...policyData }, ...prev]);
        }
      }
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.policies', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">รายการกรมธรรม์ทั้งหมด</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
          <FilePlus className="h-4 w-4" />
          {t('action.newPolicy', lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" placeholder={t('common.search', lang)} value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          <button onClick={() => setFilterCategory('All')} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${filterCategory === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            {t('common.all', lang)}
          </button>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${filterCategory === c ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              {t(`category.${c}`, lang)}
            </button>
          ))}
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as PolicyStatus | 'All')}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
        >
          <option value="All">{t('table.status', lang)}: {t('common.all', lang)}</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{t(`status.${s}`, lang)}</option>
          ))}
        </select>
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
                <th className="px-5 py-3 font-medium">{t('table.frequency', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.status', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.renewalDate', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{policy.policyNumber}</p>
                    <p className="text-xs text-gray-500">{policy.planName}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{policy.clientName}</td>
                  <td className="px-5 py-3">
                    <span className="text-gray-700">{t(`category.${policy.category}`, lang)}</span>
                    {policy.lifeSubtype && <span className="text-xs text-gray-400 block">{policy.lifeSubtype}</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{policy.provider}</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900">{policy.premium.toLocaleString('th-TH')}</td>
                  <td className="px-5 py-3 text-gray-600">{policy.premiumFrequency}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={t(`status.${policy.status}`, lang)} variant={getPolicyStatusVariant(policy.status)} />
                  </td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(policy.renewalDate)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowDetail(policy)} className="text-gray-400 hover:text-primary-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEdit(policy)} className="text-xs text-primary-600 hover:underline">
                        {t('common.edit', lang)}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-gray-400">{t('common.noData', lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title={showDetail?.policyNumber ?? ''} size="lg">
        {showDetail && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-gray-500">ลูกค้า</span><p className="font-medium">{showDetail.clientName}</p></div>
              <div><span className="text-gray-500">บริษัทประกัน</span><p className="font-medium">{showDetail.provider}</p></div>
              <div><span className="text-gray-500">แผนประกัน</span><p className="font-medium">{showDetail.planName}</p></div>
              <div><span className="text-gray-500">ประเภท</span><p className="font-medium">{t(`category.${showDetail.category}`, lang)}{showDetail.lifeSubtype ? ` - ${showDetail.lifeSubtype}` : ''}</p></div>
              <div><span className="text-gray-500">เบี้ยประกัน</span><p className="font-medium">{formatCurrency(showDetail.premium, lang)} ({showDetail.premiumFrequency})</p></div>
              <div><span className="text-gray-500">ทุนประกัน</span><p className="font-medium">{formatCurrency(showDetail.sumInsured, lang)}</p></div>
              <div><span className="text-gray-500">สถานะ</span><p><StatusBadge label={t(`status.${showDetail.status}`, lang)} variant={getPolicyStatusVariant(showDetail.status)} /></p></div>
              <div><span className="text-gray-500">วันเริ่มคุ้มครอง</span><p className="font-medium">{formatDate(showDetail.effectiveDate)}</p></div>
              <div><span className="text-gray-500">วันต่ออายุ</span><p className="font-medium">{formatDate(showDetail.renewalDate)}</p></div>
              {showDetail.category === 'Life' && (
                <div><span className="text-gray-500">วันครบกำหนด</span><p className="font-medium">{showDetail.maturityDate ? formatDate(showDetail.maturityDate) : '-'}</p></div>
              )}
            </div>
            {showDetail.notes && (
              <div><span className="text-gray-500">หมายเหตุ</span><p className="font-medium">{showDetail.notes}</p></div>
            )}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingPolicy ? 'แก้ไขกรมธรรม์' : 'เพิ่มกรมธรรม์ใหม่'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ลูกค้า *</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
                <option value="">เลือกลูกค้า...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลขกรมธรรม์ *</label>
              <input type="text" value={form.policyNumber} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทกรมธรรม์ *</label>
              <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value as PolicyCategory)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
                {categories.map((c) => <option key={c} value={c}>{t(`category.${c}`, lang)}</option>)}
              </select>
            </div>
            {isLife && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทย่อย (Life) *</label>
                <select value={form.lifeSubtype} onChange={(e) => setForm({ ...form, lifeSubtype: e.target.value as LifeSubtype })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
                  {lifeSubtypes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">บริษัทประกัน *</label>
              <input type="text" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อแผน *</label>
              <input type="text" value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เบี้ยประกัน *</label>
              <input type="number" value={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ความถี่ชำระ *
                {!isLife && <span className="text-xs text-gray-400 ml-1">(Annual เท่านั้น)</span>}
              </label>
              <select
                value={form.premiumFrequency}
                onChange={(e) => setForm({ ...form, premiumFrequency: e.target.value as PremiumFrequency })}
                disabled={!isLife}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
              >
                {availableFrequencies.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ทุนประกัน</label>
              <input type="number" value={form.sumInsured} onChange={(e) => setForm({ ...form, sumInsured: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PolicyStatus })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
                {statuses.map((s) => <option key={s} value={s}>{t(`status.${s}`, lang)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันเริ่มคุ้มครอง *</label>
              <input type="date" value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันต่ออายุ *</label>
              <input type="date" value={form.renewalDate} onChange={(e) => setForm({ ...form, renewalDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            {isLife && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันครบกำหนด (Life เท่านั้น) *</label>
                <input type="date" value={form.maturityDate} onChange={(e) => setForm({ ...form, maturityDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>

          {/* Business Rules Info Box */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-700 space-y-1">
            <p className="font-semibold">กฎธุรกิจ:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>ทุกกรมธรรม์ต้องมี <strong>วันต่ออายุ</strong></li>
              <li>กรมธรรม์ชีวิต (Life) ต้องมี <strong>วันครบกำหนด (Maturity Date)</strong></li>
              <li>กรมธรรม์ชีวิต: ชำระเบี้ยได้ Monthly / Quarterly / Semi-Annual / Annual</li>
              <li>กรมธรรม์ไม่ใช่ชีวิต: ชำระเบี้ย <strong>Annual เท่านั้น</strong></li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {t('common.cancel', lang)}
            </button>
            <button onClick={handleSave} disabled={!isValid()} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('common.save', lang)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
