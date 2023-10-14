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
import {Order, OrderDetail, OrderRequest, ResponseOrder} from '../models';
import {OrderDetailRepository, OrderRepository, ProductRepository} from '../repositories';

export class OrdersController {
  constructor(
    @repository(OrderRepository)
    public ordersRepository: OrderRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(OrderDetailRepository)
    public orderDetailRepository: OrderDetailRepository,
  ) { }

  @post('/orders')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(ResponseOrder)}},
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
  ): Promise<ResponseOrder | undefined> {
    console.log(`[orders] request: ${JSON.stringify(req)}`)
    // handle validate product, quantity, total = totalPaid + discount, total = sum(products)

    let orderTotal = 0
    // validate product
    const orderDetails: {total: number, product_id: number, quantity: number, order_id?: number}[] = []
    for (const reqProduct of req.products) {
      const product = await this.productRepository.findOne({
        where: {
          code: reqProduct.code,
        }
      })
      if (!product) {
        throw new HttpErrors[404](`Not found product with code ${reqProduct.code}`)
      }
      //validate quantity
      if (reqProduct.quantity > product.inventory || product.inventory == null) {
        throw new HttpErrors[404](`${product.code} is out of stock`)
      }
      const productTotal = product.price * reqProduct.quantity; //tong so tien cua mot don hang 0 km
      orderTotal += productTotal; //tong tien tren order

      orderDetails.push({
        product_id: product.id,
        total: productTotal,
        quantity: reqProduct.quantity
      })
      // validate total
      if (!(req.total === productTotal)) {
        throw new HttpErrors[404](`Not equal total value`)
      }
      // validate total_paid and discount
      if (!(req.total_paid === (productTotal - req.discount))) {
        throw new HttpErrors[404](`Bad Request`)
      }
      // // create order

      const newOrderData = new Order({
        customer_id: req.customer_id,
        total: orderTotal,
        name: product.name,
        quantity: reqProduct.quantity,
        product_id: product.id
      })

      console.log('[newOrderData]', newOrderData)
      const newOrder = await this.ordersRepository.create(newOrderData)
      const order = await this.ordersRepository.findById(newOrder.id, {
        include: [{
          relation: 'customer'
        }]
      })
      // create order detail
      const newOrderDetailsData = orderDetails.map((item) => new OrderDetail({
        ...item,
        order_id: newOrder.id
      }))
      const newOrderDetails = await this.orderDetailRepository.createAll(newOrderDetailsData)
      const responseOrders = new ResponseOrder({
        ...order,
        order_details: [],
      })

      const orderDetailIds = newOrderDetails?.map(it => it.id)
      if (orderDetailIds && orderDetailIds.length > 0) {
        const orderDetails = await this.orderDetailRepository.find({
          where: {id: {inq: orderDetailIds}},
          include: ['product']
        })
        responseOrders.order_details = orderDetails
      }
      // const newResponseOrders = await this.ordersRepository.create(responseOrders);
      return responseOrders;
      // return
    }
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
