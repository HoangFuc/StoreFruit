import {customAlphabet} from 'nanoid';
import {StoreApplication} from '../application';
import {Product} from '../models';
import {ProductRepository} from '../repositories';

export async function insertProducts(app: StoreApplication) {
  const nanoid = customAlphabet('ABCDEFGH123456789', 4);
  const products = [
    {name: 'Watermelon', price: 20000, inventory: 50},
    {name: 'Orange', price: 10000, inventory: 20}

  ]
  const productRepo = await app.getRepository(ProductRepository);
  for (const data of products) {
    const product = new Product({
      ...data,
      status: '10ACTIVE',
      code: nanoid()
    })
    await productRepo.create(product);
  }
}
