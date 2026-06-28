import type { AuthenticatedRequest } from '@n8n/db';
import { Body, Delete, Get, Param, Patch, Post, RestController } from '@n8n/decorators';

import { NotFoundError } from '@/errors/response-errors/not-found.error';

import { SubflowsService } from './subflows.service';

@RestController('/subflows')
export class SubflowsController {
	constructor(private readonly subflowsService: SubflowsService) {}

	@Post('/')
	async create(req: AuthenticatedRequest, _res: unknown, @Body body: { name: string; workflowId: string; nodes: unknown[]; connections: unknown }) {
		return await this.subflowsService.create(body as any);
	}

	@Get('/')
	async getAll() {
		return await this.subflowsService.getAll();
	}

	@Get('/:subflowId')
	async getById(@Param('subflowId') subflowId: string) {
		const subflow = await this.subflowsService.getById(subflowId);
		if (!subflow) {
			throw new NotFoundError('Subflow not found');
		}
		return subflow;
	}

	@Patch('/:subflowId')
	async update(
		req: AuthenticatedRequest,
		_res: unknown,
		@Param('subflowId') subflowId: string,
		@Body body: Partial<{ name: string; workflowId: string; nodes: unknown[]; connections: unknown }>,
	) {
		const subflow = await this.subflowsService.update(subflowId, body as any);
		if (!subflow) {
			throw new NotFoundError('Subflow not found');
		}
		return subflow;
	}

	@Delete('/:subflowId')
	async delete(@Param('subflowId') subflowId: string) {
		const subflow = await this.subflowsService.getById(subflowId);
		if (!subflow) {
			throw new NotFoundError('Subflow not found');
		}
		await this.subflowsService.delete(subflowId);
		return true;
	}
}
