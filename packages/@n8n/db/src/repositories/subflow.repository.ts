import { Service } from '@n8n/di';
import { DataSource, Repository } from '@n8n/typeorm';

import { SubflowEntity } from '../entities';

@Service()
export class SubflowRepository extends Repository<SubflowEntity> {
	constructor(dataSource: DataSource) {
		super(SubflowEntity, dataSource.manager);
	}
}
