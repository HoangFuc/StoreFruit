import {Entity, model, property} from '@loopback/repository';

@model()
export class Migration extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  name: string;

  constructor(data?: Partial<Migration>) {
    super(data);
  }
}

export interface MigrationRelations { }
export type MigrationWithRelations = Migration & MigrationRelations;
