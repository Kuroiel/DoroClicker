import { Decimal } from 'decimal.js';

expect.addSnapshotSerializer({
  test: (val) => val instanceof Decimal,
  print: (val) => `Decimal('${val.toString()}')`,
});