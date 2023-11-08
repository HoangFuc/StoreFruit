import {Entity, Model, belongsTo, model, property} from '@loopback/repository';
import {TimeStampMixin} from '../mixin/time-stamp-model.mixin';
import {Customer} from './customer.model';
@model()
export class Account extends TimeStampMixin(Entity) {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'number',
    default: 0
  })
  role?: number

  @belongsTo(() => Customer, {name: 'customer'})
  customer_id: number;

  constructor(data?: Partial<Account>) {
    super(data);
  }

}

export interface AccountRelations { }
export type AccountWithRelations = Account & AccountRelations;


@model()
export class Login extends Model {
  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  password: string;

  constructor(data?: Partial<Login>) {
    super(data);
  }

}
