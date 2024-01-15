import { sql as vercelSql } from '@vercel/postgres';
import { sql as pgLocalSql } from './pg-local';

export const sql = process.env.LOCAL_VERCEL_POSTGRES ? pgLocalSql : vercelSql