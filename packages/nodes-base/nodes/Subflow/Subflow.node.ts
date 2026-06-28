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
		iconColor: 'green',
		group: ['organization'],
		version: 1,
		description: 'Execute a reusable subflow created with the Subflow Composer',
		defaults: {
			name: 'Subflow',
			color: '#00A86B',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Subflow',
				name: 'subflowId',
				type: 'string',
				default: '',
				required: true,
				description:
					'The ID of the subflow to execute. Create subflows from the Subflow Library or right-click menu on the canvas.',
				placeholder: 'e.g. select a subflow from the Subflow Library',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const subflowId = this.getNodeParameter('subflowId', 0, '') as string;

		if (!subflowId) {
			throw new Error('No subflow selected. Please select a subflow in the node settings.');
		}

		// Pass-through execution for now.
		// Actual subflow execution (loading and running the inner nodes) will be wired up
		// when the execution engine integration is complete.
		return [items];
	}
}
