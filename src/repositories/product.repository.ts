import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {StoreDataSource} from '../datasources/store.datasource';
import {Order, OrderDetail} from '../models';
import {Product, ProductRelations} from '../models/product.model';
import {OrderRepository} from './order.repository';
import {OrderDetailRepository} from './orderdetail.repository';



export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  public readonly order: HasOneRepositoryFactory<Order, typeof Product.prototype.id>;
  public readonly order_details: HasManyRepositoryFactory<OrderDetail, typeof Product.prototype.id>;
  constructor(
    @inject('datasources.store') dataSource: StoreDataSource,
    @repository.getter('OrderDetailRepository')
    protected orderdetailRepositoryGetter: Getter<OrderDetailRepository>,
    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,
  ) {
    super(Product, dataSource);
    this.order_details = this.createHasManyRepositoryFactoryFor('order_details', orderdetailRepositoryGetter);
    this.registerInclusionResolver('order_details', this.order_details.inclusionResolver);

    this.order = this.createHasOneRepositoryFactoryFor('order', orderRepositoryGetter);
    this.registerInclusionResolver('order', this.order.inclusionResolver);
  }
}
