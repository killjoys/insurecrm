import { Router } from 'express';
import type { Request, Response } from 'express';
import type { TicketRepository } from '../repositories/index.js';
import type { CreateTicketDto, UpdateTicketDto, ApiResponse, Ticket } from '../types.js';

export function createTicketRoutes(repo: TicketRepository): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const query = typeof req.query.q === 'string' ? req.query.q : undefined;
      const tickets = query ? await repo.search(query) : await repo.findAll();
      res.json({ success: true, data: tickets });
    } catch (err) {
      console.error('GET /api/tickets error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const ticket = await repo.findById(String(req.params.id));
      if (!ticket) { res.status(404).json({ success: false, data: null, message: 'Ticket not found' }); return; }
      res.json({ success: true, data: ticket } satisfies ApiResponse<Ticket>);
    } catch (err) {
      console.error(`GET /api/tickets/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const dto: CreateTicketDto = req.body;
      if (!dto.clientId || !dto.subject) { res.status(400).json({ success: false, data: null, message: 'clientId and subject are required' }); return; }
      const ticket = await repo.create(dto);
      res.status(201).json({ success: true, data: ticket } satisfies ApiResponse<Ticket>);
    } catch (err) {
      console.error('POST /api/tickets error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const dto: UpdateTicketDto = req.body;
      const ticket = await repo.update(String(req.params.id), dto);
      if (!ticket) { res.status(404).json({ success: false, data: null, message: 'Ticket not found' }); return; }
      res.json({ success: true, data: ticket } satisfies ApiResponse<Ticket>);
    } catch (err) {
      console.error(`PUT /api/tickets/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deleted = await repo.delete(String(req.params.id));
      if (!deleted) { res.status(404).json({ success: false, data: null, message: 'Ticket not found' }); return; }
      res.json({ success: true, data: null, message: 'Ticket deleted' });
    } catch (err) {
      console.error(`DELETE /api/tickets/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  return router;
}
