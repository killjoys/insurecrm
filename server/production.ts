import path from 'path';
import { fileURLToPath } from 'url';
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const USE_DB = process.env.USE_DB === 'true';

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

const app = express();
app.use(cors());
app.use(express.json());

// API routes
const repos = createRepos();
app.use('/api/clients', createClientRoutes(repos.clients));
app.use('/api/leads', createLeadRoutes(repos.leads));
app.use('/api/policies', createPolicyRoutes(repos.policies));
app.use('/api/tickets', createTicketRoutes(repos.tickets));
app.use('/api/tasks', createTaskRoutes(repos.tasks));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', mockMode: !USE_DB, timestamp: new Date().toISOString() });
});

// Serve built frontend
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback — any non-API route serves index.html
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log('');
  console.log(`🚀 InsureCRM production server`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   → Data source: ${USE_DB ? 'Database' : 'Mock (in-memory)'}`);
  console.log('');
});

// Keep reference to prevent GC
server.on('error', (err) => { console.error('Server error:', err); process.exit(1); });
