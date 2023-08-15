
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources/store.datasource';
import {Migration, MigrationRelations} from '../models/migration.model';

export class MigrationRepository extends DefaultCrudRepository<
  Migration,
  typeof Migration.prototype.id,
  MigrationRelations
> {

  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,

  ) {
    super(Migration, dataSource);
  }
}
