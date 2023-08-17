import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {StoreDataSource} from '../datasources/store.datasource';
import {Account, AccountRelations, Customer} from '../models';
import {CustomerRepository} from './customer.repository';


export type Credentials = {
  username: string,
  password: string
}

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  AccountRelations
> {
  public readonly customer: BelongsToAccessor<Customer, typeof Account.prototype.id>;

  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Account, dataSource);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }
}
