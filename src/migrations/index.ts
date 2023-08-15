import {StoreApplication} from '../application';
import {MigrationRepository} from '../repositories';
import {insertProducts} from './00000.insert.product';

export async function migrations(app: StoreApplication) {
  const migrateRepo = await app.getRepository(MigrationRepository);
  const list = [
    {name: '00000.insert.product.ts', migration: insertProducts},
    {name: '00000.insert.product.ts', migration: insertProducts},
  ]

  for (const migration of list) {
    const found = await migrateRepo.findOne({
      where: {
        name: migration.name
      }
    });
    if (!found) {
      console.log(`Start ${migration.name}`);
      await migration.migration(app);
      await migrateRepo.create({
        name: migration.name
      })
      console.log(`End ${migration.name}`);
    } else {
      console.log(`Skip ${migration.name}`)
    }
  }
}
