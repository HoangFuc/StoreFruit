import {StoreApplication} from '../application';
import {Account} from '../models';
import {AccountRepository} from '../repositories';

export async function insertAccounts(app: StoreApplication) {
  const accounts = [
    {username: 'hoangphuc'},
    {username: 'tutra'},
  ]
  const accountRepo = await app.getRepository(AccountRepository);
  for (const data of accounts) {
    const account = new Account({
      ...data,
    })
    await accountRepo.create(account);
  }
}
