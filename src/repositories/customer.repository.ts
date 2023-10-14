import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {StoreDataSource} from '../datasources/store.datasource';
import {Account, Customer, CustomerRelations, Order} from '../models';
import {AccountRepository} from './account.repository';
import {OrderRepository} from './order.repository';



export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {

  public readonly account: HasOneRepositoryFactory<Account, typeof Customer.prototype.id>;
  public readonly orders: HasManyRepositoryFactory<Order, typeof Customer.prototype.id>;
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
    @repository.getter('AccountRepository')
    protected accountRepositoryGetter: Getter<AccountRepository>,
    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,
  ) {
    super(Customer, dataSource);
    this.account = this.createHasOneRepositoryFactoryFor('account', accountRepositoryGetter);
    this.registerInclusionResolver('account', this.account.inclusionResolver);
    this.orders = this.createHasManyRepositoryFactoryFor('orders', orderRepositoryGetter);
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
  }
}
