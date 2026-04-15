import { Router } from 'express';
import type { Request, Response } from 'express';
import type { PolicyRepository } from '../repositories/index.js';
import type { CreatePolicyDto, UpdatePolicyDto, ApiResponse, Policy } from '../types.js';

export function createPolicyRoutes(repo: PolicyRepository): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response) => {
    try {
      const query = typeof req.query.q === 'string' ? req.query.q : undefined;
      const clientId = typeof req.query.clientId === 'string' ? req.query.clientId : undefined;
      let policies: Policy[];
      if (clientId) policies = await repo.findByClientId(clientId);
      else if (query) policies = await repo.search(query);
      else policies = await repo.findAll();
      res.json({ success: true, data: policies });
    } catch (err) {
      console.error('GET /api/policies error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const policy = await repo.findById(String(req.params.id));
      if (!policy) { res.status(404).json({ success: false, data: null, message: 'Policy not found' }); return; }
      res.json({ success: true, data: policy } satisfies ApiResponse<Policy>);
    } catch (err) {
      console.error(`GET /api/policies/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const dto: CreatePolicyDto = req.body;
      if (!dto.clientId || !dto.policyNumber || !dto.renewalDate) {
        res.status(400).json({ success: false, data: null, message: 'clientId, policyNumber, and renewalDate are required' });
        return;
      }
      // Business rule: Life requires maturityDate
      if (dto.category === 'Life' && !dto.maturityDate) {
        res.status(400).json({ success: false, data: null, message: 'Life policies require maturityDate' });
        return;
      }
      // Business rule: Non-life must be Annual
      if (dto.category !== 'Life' && dto.premiumFrequency !== 'Annual') {
        res.status(400).json({ success: false, data: null, message: 'Non-life policies must have Annual premium frequency' });
        return;
      }
      const policy = await repo.create(dto);
      res.status(201).json({ success: true, data: policy } satisfies ApiResponse<Policy>);
    } catch (err) {
      console.error('POST /api/policies error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const dto: UpdatePolicyDto = req.body;
      const policy = await repo.update(String(req.params.id), dto);
      if (!policy) { res.status(404).json({ success: false, data: null, message: 'Policy not found' }); return; }
      res.json({ success: true, data: policy } satisfies ApiResponse<Policy>);
    } catch (err) {
      console.error(`PUT /api/policies/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deleted = await repo.delete(String(req.params.id));
      if (!deleted) { res.status(404).json({ success: false, data: null, message: 'Policy not found' }); return; }
      res.json({ success: true, data: null, message: 'Policy deleted' });
    } catch (err) {
      console.error(`DELETE /api/policies/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  return router;
}
