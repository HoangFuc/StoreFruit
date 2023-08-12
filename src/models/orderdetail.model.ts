import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Order, Product} from './index';
@model()
export class OrderDetail extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'number',
  })
  quantity: number;

  @property({
    type: 'number',
  })
  total: number;

  @belongsTo(() => Order)
  orderId: number;

  @belongsTo(() => Product, {name: 'product'})
  product_id: number;


  constructor(data?: Partial<OrderDetail>) {
    super(data);
  }
}

export interface OrderDetailRelations { }
export type OrderDetailWithRelations = OrderDetail & OrderDetailRelations;
