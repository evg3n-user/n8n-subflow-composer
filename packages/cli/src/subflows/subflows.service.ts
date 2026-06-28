import { Service } from '@n8n/di';
import { SubflowEntity, SubflowRepository } from '@n8n/db';
import type { INode, IConnections } from 'n8n-workflow';

@Service()
export class SubflowsService {
	constructor(private readonly subflowRepository: SubflowRepository) {}

	async create(data: {
		name: string;
		description?: string | null;
		workflowId: string;
		nodes: INode[];
		connections: IConnections;
		inputSchema?: Array<{ key: string; type: string; label: string }>;
		outputSchema?: Array<{ key: string; type: string; label: string }>;
	}): Promise<SubflowEntity> {
		const subflow = this.subflowRepository.create(data);
		return await this.subflowRepository.save(subflow);
	}

	async getAll(): Promise<SubflowEntity[]> {
		return await this.subflowRepository.find();
	}

	async getById(subflowId: string): Promise<SubflowEntity | null> {
		return await this.subflowRepository.findOneBy({ id: subflowId });
	}

	async update(
		subflowId: string,
		data: Partial<{
			name: string;
			description: string | null;
			workflowId: string;
			nodes: INode[];
			connections: IConnections;
			inputSchema: Array<{ key: string; type: string; label: string }>;
			outputSchema: Array<{ key: string; type: string; label: string }>;
		}>,
	): Promise<SubflowEntity | null> {
		await this.subflowRepository.update(subflowId, data);
		return await this.getById(subflowId);
	}

	async delete(subflowId: string): Promise<void> {
		await this.subflowRepository.delete(subflowId);
	}
}
