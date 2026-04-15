import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, FileText, RefreshCw, Ticket as TicketIcon,
  Plus, UserPlus, FilePlus, TicketPlus, CheckCircle2, Circle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t, formatDate } from '../../i18n';
import KpiCard from '../../components/ui/KpiCard';
import Panel from '../../components/ui/Panel';
import StatusBadge, { getTicketPriorityVariant, getTicketStatusVariant } from '../../components/ui/StatusBadge';
import { tasksApi } from '../../api/tasksApi';

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyColor(days: number): string {
  if (days <= 7) return 'bg-red-50 border-l-4 border-l-red-500';
  if (days <= 14) return 'bg-amber-50 border-l-4 border-l-amber-500';
  return 'bg-blue-50 border-l-4 border-l-blue-500';
}

function getUrgencyBadge(days: number): { label: string; variant: 'red' | 'yellow' | 'blue' } {
  if (days <= 7) return { label: `${days} วัน`, variant: 'red' };
  if (days <= 14) return { label: `${days} วัน`, variant: 'yellow' };
  return { label: `${days} วัน`, variant: 'blue' };
}

export default function OperationsView() {
  const { lang, leads, clients, policies, tickets, tasks, setTasks } = useApp();
  const navigate = useNavigate();

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const leadsThisMonth = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const activeClients = clients.length;
  const inforcedPolicies = policies.filter((p) => p.status === 'Inforced').length;

  const renewalsDue = policies.filter((p) => {
    if (p.status !== 'Inforced') return false;
    const days = getDaysUntil(p.renewalDate);
    return days >= 0 && days <= 30;
  });

  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

  const upcomingRenewals = policies
    .filter((p) => {
      if (p.status !== 'Inforced') return false;
      const days = getDaysUntil(p.renewalDate);
      return days >= 0 && days <= 30;
    })
    .sort((a, b) => getDaysUntil(a.renewalDate) - getDaysUntil(b.renewalDate));

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const todayTasks = tasks.filter((t) => t.dueDate === '2026-02-10');

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    try {
      await tasksApi.update(id, { completed: !task.completed });
    } catch {
      // API unavailable, local state is already updated
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          title={t('kpi.leadsThisMonth', lang)}
          value={leadsThisMonth}
          icon={<Users className="h-5 w-5" />}
          color="bg-blue-50 text-blue-600"
          trend={{ value: '+3 จากสัปดาห์ที่แล้ว', positive: true }}
        />
        <KpiCard
          title={t('kpi.activeClients', lang)}
          value={activeClients}
          icon={<UserCheck className="h-5 w-5" />}
          color="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          title={t('kpi.inforcedPolicies', lang)}
          value={inforcedPolicies}
          icon={<FileText className="h-5 w-5" />}
          color="bg-purple-50 text-purple-600"
        />
        <KpiCard
          title={t('kpi.renewalsDue', lang)}
          value={renewalsDue.length}
          icon={<RefreshCw className="h-5 w-5" />}
          color="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title={t('kpi.openTickets', lang)}
          value={openTickets}
          icon={<TicketIcon className="h-5 w-5" />}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: t('action.newLead', lang), icon: UserPlus, color: 'bg-blue-600 hover:bg-blue-700', to: '/leads' },
          { label: t('action.newClient', lang), icon: Plus, color: 'bg-emerald-600 hover:bg-emerald-700', to: '/clients' },
          { label: t('action.newPolicy', lang), icon: FilePlus, color: 'bg-purple-600 hover:bg-purple-700', to: '/policies' },
          { label: t('action.newTicket', lang), icon: TicketPlus, color: 'bg-orange-600 hover:bg-orange-700', to: '/tickets' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.to)}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors ${action.color}`}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Renewals */}
        <Panel
          title={t('panel.upcomingRenewals', lang)}
          action={
            <button onClick={() => navigate('/renewals')} className="text-xs text-primary-600 hover:underline">
              ดูทั้งหมด →
            </button>
          }
        >
          {upcomingRenewals.length === 0 ? (
            <p className="text-sm text-gray-400">{t('common.noData', lang)}</p>
          ) : (
            <div className="space-y-2">
              {upcomingRenewals.slice(0, 6).map((p) => {
                const days = getDaysUntil(p.renewalDate);
                const urgency = getUrgencyBadge(days);
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 ${getUrgencyColor(days)}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.clientName}</p>
                      <p className="text-xs text-gray-500">
                        {p.policyNumber} · {p.category} · {formatDate(p.renewalDate)}
                      </p>
                    </div>
                    <StatusBadge label={urgency.label} variant={urgency.variant} />
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        {/* Recent Tickets */}
        <Panel
          title={t('panel.recentTickets', lang)}
          action={
            <button onClick={() => navigate('/tickets')} className="text-xs text-primary-600 hover:underline">
              ดูทั้งหมด →
            </button>
          }
        >
          {recentTickets.length === 0 ? (
            <p className="text-sm text-gray-400">{t('common.noData', lang)}</p>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((tk) => (
                <div key={tk.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{tk.subject}</p>
                    <p className="text-xs text-gray-500">{tk.clientName} · {formatDate(tk.updatedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge label={tk.priority} variant={getTicketPriorityVariant(tk.priority)} />
                    <StatusBadge label={tk.status} variant={getTicketStatusVariant(tk.status)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* My Tasks Today */}
        <Panel title={t('panel.myTasksToday', lang)} className="lg:col-span-2">
          {todayTasks.length === 0 ? (
            <p className="text-sm text-gray-400">{t('common.noData', lang)}</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-success-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                    {task.relatedClientName && (
                      <p className="text-xs text-primary-600 mt-1">{task.relatedClientName}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
