
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources/store.datasource';
import {MigrationProduct, MigrationProductRelations} from '../models/migrationProduct.model';

export class MigrationProductRepository extends DefaultCrudRepository<
  MigrationProduct,
  typeof MigrationProduct.prototype.id,
  MigrationProductRelations
> {

  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,

  ) {
    super(MigrationProduct, dataSource);
  }
}
