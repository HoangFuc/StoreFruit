import {MixinTarget} from '@loopback/core';
import {property} from '@loopback/repository';

export function TimeStampMixin<T extends MixinTarget<object>>(baseClass: T) {
  class MixedModel extends baseClass {
    @property({
      type: 'date',
      defaultFn: 'now',
    })
    createAt?: Date;

    @property({
      type: 'date',
      defaultFn: 'now',
    })
    updatedAt?: Date;
  }

  return MixedModel;
}
