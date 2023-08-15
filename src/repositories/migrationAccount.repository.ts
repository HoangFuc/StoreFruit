import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreDataSource} from '../datasources/store.datasource';
import {MigrationAccount, MigrationAccountRelations} from '../models';

export class MigrationAccountRepository extends DefaultCrudRepository<
  MigrationAccount,
  typeof MigrationAccount.prototype.id,
  MigrationAccountRelations
> {
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
  ) {
    super(MigrationAccount, dataSource);
  }
}
