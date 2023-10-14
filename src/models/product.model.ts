import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Order} from './order.model';
import {OrderDetail} from './orderdetail.model';

@model()
export class Product extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'number',
  })
  price: number;

  @property({
    type: 'string',
    required: true
  })
  code: string;

  @property({
    type: 'string',
  })
  status: string;

  @property({
    type: 'number',
  })
  inventory: number;

  @hasMany(() => OrderDetail, {keyTo: 'product_id'})
  order_details: OrderDetail[];

  @hasOne(() => Order, {keyTo: 'product_id'})
  order: Order[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations { }
export type ProductWithRelations = Product & ProductRelations;
