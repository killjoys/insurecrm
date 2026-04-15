import { Router } from 'express';
import type { Request, Response } from 'express';
import type { ClientRepository } from '../repositories/index.js';
import type { CreateClientDto, UpdateClientDto, ApiResponse, Client } from '../types.js';

/**
 * Creates the /api/clients router.
 * The repository is injected, so it can be mock or real DB.
 */
export function createClientRoutes(repo: ClientRepository): Router {
  const router = Router();

  // GET /api/clients — list all clients (optionally search with ?q=)
  router.get('/', async (req: Request, res: Response) => {
    try {
      const query = typeof req.query.q === 'string' ? req.query.q : undefined;
      const clients = query ? await repo.search(query) : await repo.findAll();
      res.json({ success: true, data: clients });
    } catch (err) {
      console.error('GET /api/clients error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  // GET /api/clients/:id — get single client
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const client = await repo.findById(id);
      if (!client) {
        res.status(404).json({ success: false, data: null, message: 'Client not found' });
        return;
      }
      res.json({ success: true, data: client } satisfies ApiResponse<Client>);
    } catch (err) {
      console.error(`GET /api/clients/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  // POST /api/clients — create new client
  router.post('/', async (req: Request, res: Response) => {
    try {
      const dto: CreateClientDto = req.body;

      // Basic validation
      if (!dto.name || !dto.phone) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'name and phone are required',
        });
        return;
      }

      const client = await repo.create(dto);
      res.status(201).json({ success: true, data: client } satisfies ApiResponse<Client>);
    } catch (err) {
      console.error('POST /api/clients error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  // PUT /api/clients/:id — update existing client
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const dto: UpdateClientDto = req.body;
      const client = await repo.update(id, dto);
      if (!client) {
        res.status(404).json({ success: false, data: null, message: 'Client not found' });
        return;
      }
      res.json({ success: true, data: client } satisfies ApiResponse<Client>);
    } catch (err) {
      console.error(`PUT /api/clients/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  // DELETE /api/clients/:id — delete a client
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const deleted = await repo.delete(id);
      if (!deleted) {
        res.status(404).json({ success: false, data: null, message: 'Client not found' });
        return;
      }
      res.json({ success: true, data: null, message: 'Client deleted' });
    } catch (err) {
      console.error(`DELETE /api/clients/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  return router;
}
