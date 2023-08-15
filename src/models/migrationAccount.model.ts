import {Entity, model, property} from '@loopback/repository';

@model()
export class MigrationAccount extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  username: string;

  constructor(data?: Partial<MigrationAccount>) {
    super(data);
  }
}

export interface MigrationAccountRelations { }
export type MigrationAccountWithRelations = MigrationAccount & MigrationAccountRelations;
