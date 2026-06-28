import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class Subflow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Subflow',
		name: 'subflow',
		icon: 'node:subflow',
		iconColor: 'neutral',
		group: ['organization'],
		version: 1,
		description: 'Execute a reusable subflow',
		defaults: {
			name: 'Subflow',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Subflow ID',
				name: 'subflowId',
				type: 'string',
				default: '',
				required: true,
				description: 'The ID of the subflow to execute',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// For now, just pass through the input data.
		// Actual execution engine integration will be wired up later.
		return [items];
	}
}
