import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {StoreDataSource} from '../datasources';
import {Order, OrderDetail, OrderDetailRelations, Product} from '../models';
import {OrderRepository, ProductRepository} from '../repositories';

export class OrderDetailRepository extends DefaultCrudRepository<
  OrderDetail,
  typeof OrderDetail.prototype.id,
  OrderDetailRelations
> {
  public readonly order: BelongsToAccessor<Order, typeof OrderDetail.prototype.id>;
  public readonly product: BelongsToAccessor<Product, typeof OrderDetail.prototype.id>;

  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,
    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(OrderDetail, dataSource);
    this.order = this.createBelongsToAccessorFor('order', orderRepositoryGetter);
    this.registerInclusionResolver('order', this.order.inclusionResolver);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
