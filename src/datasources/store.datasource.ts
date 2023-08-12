import {inject, LifeCycleObserver, lifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'store',
  connector: 'postgresql',
  url: '',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'fruit'
};

@lifeCycleObserver('datasource')
export class StoreDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'store';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.store', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
