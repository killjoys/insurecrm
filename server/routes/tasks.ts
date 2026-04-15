import { Router } from 'express';
import type { Request, Response } from 'express';
import type { TaskRepository } from '../repositories/index.js';
import type { CreateTaskDto, UpdateTaskDto, ApiResponse, Task } from '../types.js';

export function createTaskRoutes(repo: TaskRepository): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const tasks = await repo.findAll();
      res.json({ success: true, data: tasks });
    } catch (err) {
      console.error('GET /api/tasks error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const task = await repo.findById(String(req.params.id));
      if (!task) { res.status(404).json({ success: false, data: null, message: 'Task not found' }); return; }
      res.json({ success: true, data: task } satisfies ApiResponse<Task>);
    } catch (err) {
      console.error(`GET /api/tasks/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const dto: CreateTaskDto = req.body;
      if (!dto.title || !dto.dueDate) { res.status(400).json({ success: false, data: null, message: 'title and dueDate are required' }); return; }
      const task = await repo.create(dto);
      res.status(201).json({ success: true, data: task } satisfies ApiResponse<Task>);
    } catch (err) {
      console.error('POST /api/tasks error:', err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const dto: UpdateTaskDto = req.body;
      const task = await repo.update(String(req.params.id), dto);
      if (!task) { res.status(404).json({ success: false, data: null, message: 'Task not found' }); return; }
      res.json({ success: true, data: task } satisfies ApiResponse<Task>);
    } catch (err) {
      console.error(`PUT /api/tasks/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const deleted = await repo.delete(String(req.params.id));
      if (!deleted) { res.status(404).json({ success: false, data: null, message: 'Task not found' }); return; }
      res.json({ success: true, data: null, message: 'Task deleted' });
    } catch (err) {
      console.error(`DELETE /api/tasks/${req.params.id} error:`, err);
      res.status(500).json({ success: false, data: null, message: 'Internal server error' });
    }
  });

  return router;
}
