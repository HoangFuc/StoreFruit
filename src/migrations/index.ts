import {StoreApplication} from '../application';
import {MigrationRepository} from '../repositories';
import {insertProducts} from './00000.insert.product';
import {insertAccounts} from './00010.insert.account';

export async function migrations(app: StoreApplication) {
  const migrate = await app.getRepository(MigrationRepository);
  const list = [
    {name: '00000.insert.product.ts', migration: insertProducts},
    {name: '00000.insert.product.ts', migration: insertProducts},
    {name: '00010.insert.account.ts', migration: insertAccounts},
  ]

  for (const migration of list) {
    const found = await migrate.findOne({
      where: {
        name: migration.name
      }
    });
    if (!found) {
      console.log(`Start ${migration.name}`);
      await migration.migration(app);
      await migrate.create({
        name: migration.name
      })
      console.log(`End ${migration.name}`);
    } else {
      console.log(`Skip ${migration.name}`)

    }
  }
}
