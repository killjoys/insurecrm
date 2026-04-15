import { useState } from 'react';
import { Plus, Search, Eye, Edit2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, formatDate } from '../i18n';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import type { Client, ClientTier } from '../types';
import { createClient as apiCreateClient, updateClient as apiUpdateClient } from '../api/clientsApi';

function emptyClient(): Omit<Client, 'id' | 'createdAt'> {
  return { name: '', phone: '', email: '', idCard: '', dateOfBirth: '', address: '', tier: 'Standard', notes: '' };
}

export default function ClientsPage() {
  const { lang, clients, setClients, policies, dataLoading } = useApp();
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<ClientTier | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyClient());

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === 'All' || c.tier === filterTier;
    return matchSearch && matchTier;
  });

  const openCreate = () => {
    setEditingClient(null);
    setForm(emptyClient());
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setForm({ name: client.name, phone: client.phone, email: client.email, idCard: client.idCard, dateOfBirth: client.dateOfBirth, address: client.address, tier: client.tier, notes: client.notes });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingClient) {
        // Try API first, fall back to local
        try {
          const updated = await apiUpdateClient(editingClient.id, form);
          setClients((prev) => prev.map((c) => c.id === editingClient.id ? updated : c));
        } catch {
          setClients((prev) => prev.map((c) => c.id === editingClient.id ? { ...c, ...form } : c));
        }
      } else {
        try {
          const created = await apiCreateClient(form);
          setClients((prev) => [created, ...prev]);
        } catch {
          const newClient: Client = {
            id: `c${Date.now()}`,
            ...form,
            createdAt: new Date().toISOString().split('T')[0],
          };
          setClients((prev) => [newClient, ...prev]);
        }
      }
    } finally {
      setShowModal(false);
    }
  };

  const clientPolicies = (clientId: string) => policies.filter((p) => p.clientId === clientId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.clients', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            จัดการข้อมูลลูกค้า
            {dataLoading && <Loader2 className="inline-block ml-2 h-3.5 w-3.5 animate-spin text-primary-500" />}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('action.newClient', lang)}
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
          {(['All', 'VIP', 'Standard'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterTier === tier ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              {tier === 'All' ? t('common.all', lang) : tier}
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
                <th className="px-5 py-3 font-medium">{t('table.email', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.tier', lang)}</th>
                <th className="px-5 py-3 font-medium">กรมธรรม์</th>
                <th className="px-5 py-3 font-medium">{t('table.created', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{client.name}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{client.phone}</td>
                  <td className="px-5 py-3 text-gray-500">{client.email}</td>
                  <td className="px-5 py-3">
                    <StatusBadge
                      label={client.tier}
                      variant={client.tier === 'VIP' ? 'orange' : 'blue'}
                    />
                  </td>
                  <td className="px-5 py-3 text-gray-600">{clientPolicies(client.id).length} ฉบับ</td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(client.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDetail(client)}
                        className="text-gray-400 hover:text-primary-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEdit(client)}
                        className="text-gray-400 hover:text-primary-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
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

      {/* Detail Modal */}
      <Modal
        open={!!showDetail}
        onClose={() => setShowDetail(null)}
        title={showDetail?.name ?? ''}
        size="lg"
      >
        {showDetail && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">โทรศัพท์</span>
                <p className="font-medium">{showDetail.phone}</p>
              </div>
              <div>
                <span className="text-gray-500">อีเมล</span>
                <p className="font-medium">{showDetail.email}</p>
              </div>
              <div>
                <span className="text-gray-500">เลขบัตรประชาชน</span>
                <p className="font-medium">{showDetail.idCard || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">วันเกิด</span>
                <p className="font-medium">{showDetail.dateOfBirth ? formatDate(showDetail.dateOfBirth) : '-'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">ที่อยู่</span>
                <p className="font-medium">{showDetail.address || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">ระดับ</span>
                <p className="font-medium">
                  <StatusBadge label={showDetail.tier} variant={showDetail.tier === 'VIP' ? 'orange' : 'blue'} />
                </p>
              </div>
              <div>
                <span className="text-gray-500">หมายเหตุ</span>
                <p className="font-medium">{showDetail.notes || '-'}</p>
              </div>
            </div>

            {/* Client's policies */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">กรมธรรม์ของลูกค้า</h3>
              {clientPolicies(showDetail.id).length === 0 ? (
                <p className="text-sm text-gray-400">ยังไม่มีกรมธรรม์</p>
              ) : (
                <div className="space-y-2">
                  {clientPolicies(showDetail.id).map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.planName}</p>
                        <p className="text-xs text-gray-500">{p.policyNumber} · {p.category}{p.lifeSubtype ? ` (${p.lifeSubtype})` : ''}</p>
                      </div>
                      <StatusBadge
                        label={t(`status.${p.status}`, lang)}
                        variant={p.status === 'Inforced' ? 'green' : p.status === 'Pending' ? 'yellow' : p.status === 'Lapsed' ? 'red' : 'gray'}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingClient ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้าใหม่'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">โทรศัพท์ *</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เลขบัตรประชาชน</label>
              <input type="text" value={form.idCard} onChange={(e) => setForm({ ...form, idCard: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันเกิด</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ระดับลูกค้า</label>
              <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as ClientTier })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {t('common.cancel', lang)}
            </button>
            <button onClick={handleSave} disabled={!form.name || !form.phone} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('common.save', lang)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
