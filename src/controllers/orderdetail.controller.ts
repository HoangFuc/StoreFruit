import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {OrderDetail} from '../models';
import {OrderDetailRepository} from '../repositories';

export class OrderDetailsController {
  constructor(
    @repository(OrderDetailRepository)
    public orderDetailRepository: OrderDetailRepository,
    // @repository(ProductRepository)
    // public productRepository: ProductRepository,

  ) { }

  @post('/order-details')
  @response(200, {
    description: 'OrderDetail model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderDetail)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderDetail, {
            title: 'NewOrderDetail',
            exclude: ['id', 'total']
          }),
        },
      },
    })
    orderDetail: Omit<OrderDetail, 'id'>,
  ): Promise<OrderDetail> {
    return this.orderDetailRepository.create(orderDetail);
  }

  @get('/order-details/count')
  @response(200, {
    description: 'OrderDetail model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OrderDetail) where?: Where<OrderDetail>,
  ): Promise<Count> {
    return this.orderDetailRepository.count(where);
  }

  @get('/order-details')
  @response(200, {
    description: 'Array of OrderDetail model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OrderDetail, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OrderDetail) filter?: Filter<OrderDetail>,
  ): Promise<OrderDetail[]> {
    return this.orderDetailRepository.find(filter);
  }

  @patch('/order-details')
  @response(200, {
    description: 'OrderDetail PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderDetail, {partial: true}),
        },
      },
    })
    orderDetail: OrderDetail,
    @param.where(OrderDetail) where?: Where<OrderDetail>,
  ): Promise<Count> {
    return this.orderDetailRepository.updateAll(orderDetail, where);
  }

  @get('/order-details/{id}')
  @response(200, {
    description: 'OrderDetail model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OrderDetail, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OrderDetail, {exclude: 'where'}) filter?: FilterExcludingWhere<OrderDetail>
  ): Promise<OrderDetail> {
    return this.orderDetailRepository.findById(id, filter);
  }

  @patch('/order-details/{id}')
  @response(204, {
    description: 'OrderDetail PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderDetail, {partial: true}),
        },
      },
    })
    orderDetail: OrderDetail,
  ): Promise<void> {
    await this.orderDetailRepository.updateById(id, orderDetail);
  }

  @put('/order-details/{id}')
  @response(204, {
    description: 'OrderDetail PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() orderDetail: OrderDetail,
  ): Promise<void> {
    await this.orderDetailRepository.replaceById(id, orderDetail);
  }

  @del('/order-details/{id}')
  @response(204, {
    description: 'OrderDetail DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.orderDetailRepository.deleteById(id);
  }
}
