import { Router } from 'express';
import type { Request, Response } from 'express';
import type { LeadRepository } from '../repositories/index.js';
import type { CreateLeadDto, UpdateLeadDto, ApiResponse, Lead } from '../types.js';

export function createLeadRoutes(repo: LeadRepository): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const query = typeof req.query.q === 'string' ? req.query.q : undefined;
      const leads = query ? await repo.search(query) : await repo.findAll();
      res.json({ success: true, data: leads });
    } catch (err) {
      console.error('GET /api/leads error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const lead = await repo.findById(String(req.params.id));
      if (!lead) { res.status(404).json({ success: false, data: null, message: 'Lead not found' }); return; }
      res.json({ success: true, data: lead } satisfies ApiResponse<Lead>);
    } catch (err) {
      console.error(`GET /api/leads/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const dto: CreateLeadDto = req.body;
      if (!dto.name || !dto.phone) { res.status(400).json({ success: false, data: null, message: 'name and phone are required' }); return; }
      const lead = await repo.create(dto);
      res.status(201).json({ success: true, data: lead } satisfies ApiResponse<Lead>);
    } catch (err) {
      console.error('POST /api/leads error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const dto: UpdateLeadDto = req.body;
      const lead = await repo.update(String(req.params.id), dto);
      if (!lead) { res.status(404).json({ success: false, data: null, message: 'Lead not found' }); return; }
      res.json({ success: true, data: lead } satisfies ApiResponse<Lead>);
    } catch (err) {
      console.error(`PUT /api/leads/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deleted = await repo.delete(String(req.params.id));
      if (!deleted) { res.status(404).json({ success: false, data: null, message: 'Lead not found' }); return; }
      res.json({ success: true, data: null, message: 'Lead deleted' });
    } catch (err) {
      console.error(`DELETE /api/leads/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  return router;
}
