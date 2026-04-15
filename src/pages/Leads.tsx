import { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, formatDate } from '../i18n';
import StatusBadge, { getLeadStageVariant } from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import type { Lead, LeadStage, PolicyCategory } from '../types';
import { leadsApi } from '../api/leadsApi';
import { clientsApi } from '../api/clientsApi';

const stages: LeadStage[] = ['New', 'Contacted', 'Quoted', 'Closed'];
const categories: PolicyCategory[] = ['Life', 'Health', 'PA', 'Motor', 'Fire', 'Other'];

function emptyLead(): Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> {
  return { name: '', phone: '', email: '', source: '', stage: 'New', interest: 'Life', notes: '' };
}

export default function LeadsPage() {
  const { lang, leads, setLeads, setClients } = useApp();
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState<LeadStage | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState(emptyLead());

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'All' || l.stage === filterStage;
    return matchSearch && matchStage;
  });

  const openCreate = () => {
    setEditingLead(null);
    setForm(emptyLead());
    setShowModal(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setForm({ name: lead.name, phone: lead.phone, email: lead.email, source: lead.source, stage: lead.stage, interest: lead.interest, notes: lead.notes });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingLead) {
        try {
          const updated = await leadsApi.update(editingLead.id, form);
          setLeads((prev) => prev.map((l) => l.id === editingLead.id ? updated : l));
        } catch {
          const now = new Date().toISOString().split('T')[0];
          setLeads((prev) => prev.map((l) => l.id === editingLead.id ? { ...l, ...form, updatedAt: now } : l));
        }
      } else {
        try {
          const created = await leadsApi.create(form);
          setLeads((prev) => [created, ...prev]);
        } catch {
          const now = new Date().toISOString().split('T')[0];
          const newLead: Lead = { id: `l${Date.now()}`, ...form, createdAt: now, updatedAt: now };
          setLeads((prev) => [newLead, ...prev]);
        }
      }
    } finally {
      setShowModal(false);
    }
  };

  const convertToClient = async (lead: Lead) => {
    try {
      const created = await clientsApi.create({
        name: lead.name, phone: lead.phone, email: lead.email,
        idCard: '', dateOfBirth: '', address: '', tier: 'Standard',
        notes: `แปลงจากลีด: ${lead.notes}`,
      });
      setClients((prev) => [created, ...prev]);
      try {
        const updated = await leadsApi.update(lead.id, { stage: 'Closed', convertedToClientId: created.id });
        setLeads((prev) => prev.map((l) => l.id === lead.id ? updated : l));
      } catch {
        setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, stage: 'Closed' as LeadStage, convertedToClientId: created.id, updatedAt: new Date().toISOString().split('T')[0] } : l));
      }
    } catch {
      // Fallback to local
      const newClient = {
        id: `c${Date.now()}`, name: lead.name, phone: lead.phone, email: lead.email,
        idCard: '', dateOfBirth: '', address: '', tier: 'Standard' as const,
        createdAt: new Date().toISOString().split('T')[0], notes: `แปลงจากลีด: ${lead.notes}`,
      };
      setClients((prev) => [newClient, ...prev]);
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, stage: 'Closed' as LeadStage, convertedToClientId: newClient.id, updatedAt: new Date().toISOString().split('T')[0] } : l));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.leads', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการลีดและติดตามสถานะ</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          {t('action.newLead', lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search', lang)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilterStage('All')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterStage === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            {t('common.all', lang)}
          </button>
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStage(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterStage === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              {t(`stage.${s}`, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <th className="px-5 py-3 font-medium">{t('table.name', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.phone', lang)}</th>
                <th className="px-5 py-3 font-medium">แหล่งที่มา</th>
                <th className="px-5 py-3 font-medium">สนใจ</th>
                <th className="px-5 py-3 font-medium">{t('table.stage', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.created', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{lead.phone}</td>
                  <td className="px-5 py-3 text-gray-600">{lead.source}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={t(`category.${lead.interest}`, lang)} variant="blue" />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge label={t(`stage.${lead.stage}`, lang)} variant={getLeadStageVariant(lead.stage)} />
                  </td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(lead.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(lead)}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        {t('common.edit', lang)}
                      </button>
                      {lead.stage !== 'Closed' && (
                        <button
                          onClick={() => convertToClient(lead)}
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          {t('common.convertToClient', lang)}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">{t('common.noData', lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingLead ? 'แก้ไขลีด' : 'เพิ่มลีดใหม่'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">โทรศัพท์ *</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">แหล่งที่มา</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              >
                <option value="">เลือก...</option>
                <option value="Facebook">Facebook</option>
                <option value="Line OA">Line OA</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Website">Website</option>
                <option value="Other">อื่นๆ</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สนใจประเภท</label>
              <select
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value as PolicyCategory })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{t(`category.${c}`, lang)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ขั้นตอน</label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value as LeadStage })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              >
                {stages.map((s) => (
                  <option key={s} value={s}>{t(`stage.${s}`, lang)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('common.cancel', lang)}
            </button>
            <button
              onClick={handleSave}
              disabled={!form.name || !form.phone}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.save', lang)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
