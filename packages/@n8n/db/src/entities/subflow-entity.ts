import { Column, Entity } from '@n8n/typeorm';
import type { IConnections, INode } from 'n8n-workflow';

import { JsonColumn, WithTimestampsAndStringId } from './abstract-entity';

@Entity()
export class SubflowEntity extends WithTimestampsAndStringId {
	@Column({ length: 128 })
	name: string;

	@Column({ type: 'text', nullable: true })
	description: string | null;

	@Column()
	workflowId: string;

	@JsonColumn()
	nodes: INode[];

	@JsonColumn()
	connections: IConnections;

	@JsonColumn({ nullable: true })
	inputSchema: Array<{ key: string; type: string; label: string }>;

	@JsonColumn({ nullable: true })
	outputSchema: Array<{ key: string; type: string; label: string }>;

	@Column({ type: 'varchar', nullable: true })
	versionId: string | null;
}
