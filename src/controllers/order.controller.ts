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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {Order, OrderRequest} from '../models';
import {OrderRepository, ProductRepository} from '../repositories';

export class OrdersController {
  constructor(
    @repository(OrderRepository)
    public ordersRepository: OrderRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @post('/orders')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderRequest, {
            title: 'CreateOrder',
          }),
        },
      },
    })
    req: OrderRequest,
  ): Promise<Order | undefined> {
    console.log(`[orders] request: ${JSON.stringify(req)}`)
    // handle validate product, quantity, total = totalPaid + discount, total = sum(products)

    let orderTotal = 0
    // validate product
    const orderDetails: {total: number, productId: number, quantity: number, order_id?: number}[] = []
    for (const reqProduct of req.products) {
      const product = await this.productRepository.findOne({
        where: {
          code: reqProduct.code,
        }
      })
      if (!product) {
        throw new HttpErrors[404](`Not found product with code ${reqProduct.code}`)
      }
      // after that validate quantity
      if (reqProduct.quantity > product.inventory || product.inventory == null) {
        throw new HttpErrors[404](`${product.code} is out of stock`)
      }
      const productTotal = product.price * reqProduct.quantity; //tong so tien cua mot don hang 0 km
      orderTotal += productTotal; //tong tien tren order

      orderDetails.push({
        productId: product.id,
        total: productTotal,
        quantity: reqProduct.quantity
      })
    }
    // validate total
    // // create order
    const newOrderData = new Order({
      customer_id: req.customer_id,
      total: orderTotal,
    })
    const newOrder = await this.ordersRepository.create(newOrderData)
    // create order detail
    let newOrderDetails = orderDetails.map((item) => ({
      ...item,
      order_id: newOrder.id
    }))
    console.log(newOrderDetails);
    // console.log(orderDetails)

    // return resS
    return
    // return this.ordersRepository.create();
  }

  @get('/orders/count')
  @response(200, {
    description: 'Order model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.ordersRepository.count(where);
  }

  @get('/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Order) filter?: Filter<Order>,
  ): Promise<Order[]> {
    return this.ordersRepository.find(filter);
  }

  @patch('/orders')
  @response(200, {
    description: 'Order PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.ordersRepository.updateAll(order, where);
  }

  @get('/orders/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Order, {exclude: 'where'}) filter?: FilterExcludingWhere<Order>
  ): Promise<Order> {
    return this.ordersRepository.findById(id, filter);
  }

  @patch('/orders/{id}')
  @response(204, {
    description: 'Order PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
  ): Promise<void> {
    await this.ordersRepository.updateById(id, order);
  }

  @put('/orders/{id}')
  @response(204, {
    description: 'Order PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() order: Order,
  ): Promise<void> {
    await this.ordersRepository.replaceById(id, order);
  }

  @del('/orders/{id}')
  @response(204, {
    description: 'Order DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ordersRepository.deleteById(id);
  }
}
