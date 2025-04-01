import { MikroORM } from '@mikro-orm/postgresql';
import { Entity, PrimaryKey, Property, Utils } from '@mikro-orm/core';

const schema = `
  CREATE TABLE IF NOT EXISTS test (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "at" DATE
  );
`;

@Entity({ schema: 'public' })
export class Test {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'date', nullable: true })
  at?: string;
}

describe('date type [postgresql]', () => {
  test('uses correct runtime type', async () => {
    const orm = await MikroORM.init({
      dbName: 'date-type-test',
      ensureDatabase: { create: true, truncate: true },
      entities: [Test],
      allowGlobalContext: true,
    });

    await orm.schema.execute(schema);

    orm.em.create(Test, { at: '2020-01-01' });
    await orm.em.flush();
    await orm.em.clear();

    const data = await orm.em.findAll(Test);

    expect(Utils.isString(data[0].at)).toBeTruthy();
    await orm.close(true);
  });
});
