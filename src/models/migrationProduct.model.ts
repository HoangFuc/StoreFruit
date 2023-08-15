import {Entity, model, property} from '@loopback/repository';

@model()
export class MigrationProduct extends Entity {
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

  constructor(data?: Partial<MigrationProduct>) {
    super(data);
  }
}

export interface MigrationProductRelations { }
export type MigrationProductWithRelations = MigrationProduct & MigrationProductRelations;
