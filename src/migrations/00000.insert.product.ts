import {customAlphabet} from 'nanoid';
import {StoreApplication} from '../application';
import {Product} from '../models';
import {ProductRepository} from '../repositories';

export async function insertProducts(app: StoreApplication) {
  const nanoid = customAlphabet('ABCDEFGHKIJ123456789', 4);
  const products = [
    {name: 'Watermelon', price: 20000, inventory: 50},
    {name: 'Orange', price: 10000, inventory: 100},
    {name: 'Avocado', price: 15000, inventory: 200},
    {name: 'Banana', price: 7000, inventory: 40},
    {name: 'Mango', price: 17000, inventory: 50},
    {name: 'Grape', price: 40000, inventory: 60},
    {name: 'Papaya', price: 15000, inventory: 20},
    {name: 'Peach', price: 23000, inventory: 20},
    {name: 'Sapota', price: 23000, inventory: 20}
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
