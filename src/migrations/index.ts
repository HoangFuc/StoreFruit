import {StoreApplication} from '../application';
import {MigrationAccountRepository, MigrationProductRepository} from '../repositories';
import {insertProducts} from './00000.insert.product';
import {insertAccounts} from './00010.insert.account';

export async function migrations(app: StoreApplication) {
  const migrateProductRepo = await app.getRepository(MigrationProductRepository);
  const migrateAccountRepo = await app.getRepository(MigrationAccountRepository);
  const list = [
    {name: '00000.insert.product.ts', migration: insertProducts},
    {name: '00000.insert.product.ts', migration: insertProducts},
    {name: '00010.insert.account.ts', migration: insertAccounts},
  ]

  for (const migration of list) {
    const found = await migrateProductRepo.findOne({
      where: {
        name: migration.name
      }
    });
    if (!found) {
      console.log(`Start ${migration.name}`);
      await migration.migration(app);
      await migrateProductRepo.create({
        name: migration.name
      })
      console.log(`End ${migration.name}`);
    } else {
      console.log(`Skip ${migration.name}`)
    }
  }
}
