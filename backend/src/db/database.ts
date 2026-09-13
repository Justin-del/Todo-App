import Database from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import type { DB } from './types.js';

export const sqlite = new Database((process.env.NODE_ENV?.trim()==='test')?'Test.sqlite':'Database.sqlite');

const dialect = new SqliteDialect({
  database:  sqlite
})

export const db = new Kysely<DB>({dialect});