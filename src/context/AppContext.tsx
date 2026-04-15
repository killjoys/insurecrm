import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language } from '../i18n';
import type { Lead, Client, Policy, Ticket, Task } from '../types';
import {
  leads as seedLeads,
  clients as seedClients,
  policies as seedPolicies,
  tickets as seedTickets,
  tasks as seedTasks,
} from '../data/seed';
import { clientsApi } from '../api/clientsApi';
import { leadsApi } from '../api/leadsApi';
import { policiesApi } from '../api/policiesApi';
import { ticketsApi } from '../api/ticketsApi';
import { tasksApi } from '../api/tasksApi';

interface AppState {
  lang: Language;
  setLang: (l: Language) => void;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  policies: Policy[];
  setPolicies: React.Dispatch<React.SetStateAction<Policy[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshClients: () => Promise<void>;
  refreshLeads: () => Promise<void>;
  refreshPolicies: () => Promise<void>;
  refreshTickets: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  dataLoading: boolean;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('th');
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [policies, setPolicies] = useState<Policy[]>(seedPolicies);
  const [tickets, setTickets] = useState<Ticket[]>(seedTickets);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const refreshClients = useCallback(async () => {
    try { setClients(await clientsApi.fetchAll()); } catch { /* keep seed */ }
  }, []);

  const refreshLeads = useCallback(async () => {
    try { setLeads(await leadsApi.fetchAll()); } catch { /* keep seed */ }
  }, []);

  const refreshPolicies = useCallback(async () => {
    try { setPolicies(await policiesApi.fetchAll()); } catch { /* keep seed */ }
  }, []);

  const refreshTickets = useCallback(async () => {
    try { setTickets(await ticketsApi.fetchAll()); } catch { /* keep seed */ }
  }, []);

  const refreshTasks = useCallback(async () => {
    try { setTasks(await tasksApi.fetchAll()); } catch { /* keep seed */ }
  }, []);

  // Fetch all data from backend on mount
  useEffect(() => {
    setDataLoading(true);
    Promise.allSettled([
      refreshClients(),
      refreshLeads(),
      refreshPolicies(),
      refreshTickets(),
      refreshTasks(),
    ]).finally(() => setDataLoading(false));
  }, [refreshClients, refreshLeads, refreshPolicies, refreshTickets, refreshTasks]);

  return (
    <AppContext.Provider
      value={{
        lang, setLang,
        leads, setLeads,
        clients, setClients,
        policies, setPolicies,
        tickets, setTickets,
        tasks, setTasks,
        sidebarOpen, setSidebarOpen,
        refreshClients, refreshLeads, refreshPolicies, refreshTickets, refreshTasks,
        dataLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
