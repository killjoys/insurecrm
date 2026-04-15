import { useState } from 'react';
import { TicketPlus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, formatDate } from '../i18n';
import StatusBadge, { getTicketPriorityVariant, getTicketStatusVariant } from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import type { Ticket, TicketPriority, TicketStatus } from '../types';
import { ticketsApi } from '../api/ticketsApi';

const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
const ticketStatuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

interface TicketForm {
  clientId: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
}

function emptyForm(): TicketForm {
  return { clientId: '', subject: '', description: '', priority: 'Medium', status: 'Open' };
}

export default function TicketsPage() {
  const { lang, tickets, setTickets, clients } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [form, setForm] = useState<TicketForm>(emptyForm());

  const filtered = tickets.filter((tk) => {
    const matchSearch =
      tk.subject.toLowerCase().includes(search.toLowerCase()) ||
      tk.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || tk.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setEditingTicket(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setForm({ clientId: ticket.clientId, subject: ticket.subject, description: ticket.description, priority: ticket.priority, status: ticket.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    const clientName = clients.find((c) => c.id === form.clientId)?.name ?? '';
    const ticketData = { ...form, clientName };
    try {
      if (editingTicket) {
        try {
          const updated = await ticketsApi.update(editingTicket.id, ticketData);
          setTickets((prev) => prev.map((tk) => tk.id === editingTicket.id ? updated : tk));
        } catch {
          const now = new Date().toISOString().split('T')[0];
          setTickets((prev) => prev.map((tk) => tk.id === editingTicket.id ? { ...tk, ...ticketData, updatedAt: now } : tk));
        }
      } else {
        try {
          const created = await ticketsApi.create(ticketData);
          setTickets((prev) => [created, ...prev]);
        } catch {
          const now = new Date().toISOString().split('T')[0];
          const newTicket: Ticket = { id: `t${Date.now()}`, ...ticketData, createdAt: now, updatedAt: now };
          setTickets((prev) => [newTicket, ...prev]);
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
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.tickets', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการตั๋วงานและคำร้องจากลูกค้า</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
          <TicketPlus className="h-4 w-4" />
          {t('action.newTicket', lang)}
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
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          <button onClick={() => setFilterStatus('All')} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            {t('common.all', lang)}
          </button>
          {ticketStatuses.map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              {s}
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
                <th className="px-5 py-3 font-medium">{t('table.subject', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.client', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.priority', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.status', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.created', lang)}</th>
                <th className="px-5 py-3 font-medium">{t('table.actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{ticket.description}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{ticket.clientName}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={ticket.priority} variant={getTicketPriorityVariant(ticket.priority)} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge label={ticket.status} variant={getTicketStatusVariant(ticket.status)} />
                  </td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(ticket.createdAt)}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => openEdit(ticket)} className="text-xs text-primary-600 hover:underline">
                      {t('common.edit', lang)}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">{t('common.noData', lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingTicket ? 'แก้ไขตั๋วงาน' : 'สร้างตั๋วงานใหม่'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ลูกค้า *</label>
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
              <option value="">เลือกลูกค้า...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อ *</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ความสำคัญ</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TicketStatus })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none">
                {ticketStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {t('common.cancel', lang)}
            </button>
            <button onClick={handleSave} disabled={!form.clientId || !form.subject} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('common.save', lang)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
