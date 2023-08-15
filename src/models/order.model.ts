import {Entity, belongsTo, hasMany, model, property} from '@loopback/repository';
import {TimeStampMixin} from '../mixin/time-stamp-model.mixin';
import {Customer, OrderDetail} from '../models';
@model()
export class Order extends TimeStampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'number',
  })
  total: number;

  @belongsTo(() => Customer, {name: 'customer'})
  customer_id: number;

  @hasMany(() => OrderDetail, {keyTo: 'order_id'})
  order_details: OrderDetail[];

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations { }
export type OrderWithRelations = Order & OrderRelations;

@model()
export class OrderProductRequest {
  @property({
    type: 'string'
  })
  code: string

  @property({
    type: 'number'
  })
  quantity: number
}

@model()
export class OrderRequest extends Entity {
  @property({
    type: 'array',
    itemType: OrderProductRequest
  })
  products: OrderProductRequest[];

  @property({
    type: 'number',
  })
  discount: number; // KM

  @property({
    type: 'number',
  })
  total: number; // so tien don hang truoc khuyen mai

  @property({
    type: 'number',
  })
  total_paid: number; // so tien KH thanh toan

  @property({
    type: 'number',
  })
  customer_id?: number;

  constructor(data?: Partial<OrderRequest>) {
    super(data);
  }
}

@model()
export class ResponseOrder extends Order {

  @property({
    type: 'array',
    itemType: Object,
  })
  orders: Order[];

  @property({
    type: 'array',
    itemType: Object,
  })
  order_details: OrderDetail[];

  constructor(data?: Partial<ResponseOrder>) {
    super(data);
  }
}
