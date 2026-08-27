import { rm } from 'node:fs/promises';

await Promise.all([
  rm('site-dist', { force: true, recursive: true }),
  rm('test/.tmp', { force: true, recursive: true })
]);
