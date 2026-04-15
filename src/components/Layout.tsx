import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  RefreshCw,
  Ticket,
  Settings,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'nav.dashboard' },
  { to: '/leads', icon: Users, label: 'nav.leads' },
  { to: '/clients', icon: UserCheck, label: 'nav.clients' },
  { to: '/policies', icon: FileText, label: 'nav.policies' },
  { to: '/renewals', icon: RefreshCw, label: 'nav.renewals' },
  { to: '/tickets', icon: Ticket, label: 'nav.tickets' },
  { to: '/settings', icon: Settings, label: 'nav.settings' },
];

export default function Layout() {
  const { lang, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-white
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">InsureCRM</h1>
            <p className="text-[11px] text-gray-400 leading-none">ระบบจัดการประกันภัย</p>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {t(item.label, lang)}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Agent สมศักดิ์</p>
              <p className="text-xs text-gray-400 truncate">somsakagent@email.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6 shrink-0">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => {}}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md px-2.5 py-1"
          >
            {lang === 'th' ? 'TH' : 'EN'}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
