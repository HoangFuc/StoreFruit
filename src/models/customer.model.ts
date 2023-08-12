import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Account, Order} from './index';
@model()
export class Customer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      name: 'custom_id'
    },
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  full_name: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'date',
  })
  birthday: Date;

  @property({
    type: 'string',
  })
  phone: string;

  @property({
    type: 'string',
  })
  email: string;

  @hasOne(() => Account, {keyTo: 'customer_id'})
  account: Account[];

  @hasMany(() => Order, {keyTo: 'customer_id'})
  orders: Order[];

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}
export interface CustomerRelations { }
export type CustomerWithRelations = Customer & CustomerRelations;
