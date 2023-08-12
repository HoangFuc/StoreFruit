import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {Customer, Order, OrderDetail, OrderRelations} from '../models';
import {CustomerRepository} from './customer.repository';
import {OrderDetailRepository} from './orderdetail.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {

  public readonly customer: BelongsToAccessor<Customer, typeof Order.prototype.id>;
  public readonly order_details: HasManyRepositoryFactory<OrderDetail, typeof Order.prototype.id>;
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
    @repository.getter('OrderDetailRepository')
    protected orderDetailRepositoryGetter: Getter<OrderDetailRepository>,
  ) {
    super(Order, dataSource);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);

    this.order_details = this.createHasManyRepositoryFactoryFor('order_details', orderDetailRepositoryGetter);
    this.registerInclusionResolver('order_details', this.order_details.inclusionResolver);
  }
}
