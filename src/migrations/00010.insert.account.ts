import bcrypt from 'bcrypt';
import {StoreApplication} from '../application';
import {Account} from '../models';
import {AccountRepository} from '../repositories';
export async function insertAccounts(app: StoreApplication) {
  const {
    createHash,
  } = await import('node:crypto');

  const accounts = [
    {username: 'hoangphuc', password: 'abc123123'},
    {username: 'tutra', password: 'bacbac123123'},
  ]
  const accountRepo = await app.getRepository(AccountRepository);
  for (const data of accounts) {
    // const value = createHash('sha256');
    const npw = await bcrypt.hash(data.password, 10);
    const account = new Account({
      ...data,
      // password: value.digest('hex'),
      password: npw,
    })
    await accountRepo.create(account);
  }
}
