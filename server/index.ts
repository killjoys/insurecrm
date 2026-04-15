import express from 'express';
import cors from 'cors';
import {
  MockClientRepository, DbClientRepository,
  MockLeadRepository, DbLeadRepository,
  MockPolicyRepository, DbPolicyRepository,
  MockTicketRepository, DbTicketRepository,
  MockTaskRepository, DbTaskRepository,
} from './repositories/index.js';
import type {
  ClientRepository, LeadRepository, PolicyRepository, TicketRepository, TaskRepository,
} from './repositories/index.js';
import { createClientRoutes } from './routes/clients.js';
import { createLeadRoutes } from './routes/leads.js';
import { createPolicyRoutes } from './routes/policies.js';
import { createTicketRoutes } from './routes/tickets.js';
import { createTaskRoutes } from './routes/tasks.js';

// ─── Configuration ──────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const USE_DB = process.env.USE_DB === 'true';

// ─── Repository factories ───────────────────────────────────────────

function createRepos() {
  if (USE_DB) {
    console.log('📦 Using Database repositories');
    return {
      clients: new DbClientRepository() as ClientRepository,
      leads: new DbLeadRepository() as LeadRepository,
      policies: new DbPolicyRepository() as PolicyRepository,
      tickets: new DbTicketRepository() as TicketRepository,
      tasks: new DbTaskRepository() as TaskRepository,
    };
  }

  console.log('🧪 Using Mock repositories (in-memory data)');
  return {
    clients: new MockClientRepository() as ClientRepository,
    leads: new MockLeadRepository() as LeadRepository,
    policies: new MockPolicyRepository() as PolicyRepository,
    tickets: new MockTicketRepository() as TicketRepository,
    tasks: new MockTaskRepository() as TaskRepository,
  };
}

// ─── Express app ────────────────────────────────────────────────────

const app = express();

app.use(cors({
  origin: NODE_ENV === 'development' ? 'http://localhost:5173' : undefined,
}));
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ─── Routes ─────────────────────────────────────────────────────────

const repos = createRepos();

app.use('/api/clients', createClientRoutes(repos.clients));
app.use('/api/leads', createLeadRoutes(repos.leads));
app.use('/api/policies', createPolicyRoutes(repos.policies));
app.use('/api/tickets', createTicketRoutes(repos.tickets));
app.use('/api/tasks', createTaskRoutes(repos.tasks));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: NODE_ENV,
    mockMode: !USE_DB,
    timestamp: new Date().toISOString(),
  });
});

// ─── Start ──────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('');
  console.log(`🚀 InsureCRM API server running`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   → Environment: ${NODE_ENV}`);
  console.log(`   → Data source: ${USE_DB ? 'Database' : 'Mock (in-memory)'}`);
  console.log(`   → Endpoints: /api/clients, /api/leads, /api/policies, /api/tickets, /api/tasks`);
  console.log('');
});
