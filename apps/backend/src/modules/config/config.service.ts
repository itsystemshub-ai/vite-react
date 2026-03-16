import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfigSystemService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.systemConfig.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] }); }

  async get(key: string) {
    const c = await this.prisma.systemConfig.findUnique({ where: { key } });
    return c?.value;
  }

  upsert(key: string, value: string, group = 'general') {
    return this.prisma.systemConfig.upsert({ where: { key }, update: { value }, create: { key, value, group } });
  }

  async upsertMany(configs: { key: string; value: string; group?: string }[]) {
    for (const c of configs) await this.upsert(c.key, c.value, c.group);
    return this.findAll();
  }

  // Schema Inspector
  async getAllTables() {
    return this.prisma.$queryRaw<any[]>`
      SELECT t.table_name,
        (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS column_count,
        pgc.reltuples::bigint AS estimated_rows
      FROM information_schema.tables t
      JOIN pg_class pgc ON pgc.relname = t.table_name
      WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name
    `;
  }

  async getTableColumns(tableName: string) {
    return this.prisma.$queryRaw<any[]>`
      SELECT c.column_name, c.data_type, c.udt_name, c.is_nullable, c.column_default, c.ordinal_position,
        CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END AS is_primary_key,
        CASE WHEN uq.column_name IS NOT NULL THEN true ELSE false END AS is_unique,
        CASE WHEN fk.column_name IS NOT NULL THEN true ELSE false END AS is_foreign_key,
        fk.foreign_table_name, fk.foreign_column_name
      FROM information_schema.columns c
      LEFT JOIN (SELECT ku.column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = ${tableName}) pk ON pk.column_name = c.column_name
      LEFT JOIN (SELECT ku.column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name WHERE tc.constraint_type = 'UNIQUE' AND tc.table_name = ${tableName}) uq ON uq.column_name = c.column_name
      LEFT JOIN (SELECT kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = ${tableName}) fk ON fk.column_name = c.column_name
      WHERE c.table_name = ${tableName} AND c.table_schema = 'public'
      ORDER BY c.ordinal_position
    `;
  }

  async getTableData(tableName: string, page = 1, limit = 50, orderBy?: string, orderDir: 'ASC' | 'DESC' = 'ASC') {
    const valid = await this.getAllTables();
    if (!valid.some((t: any) => t.table_name === tableName)) throw new Error('Tabla no válida');
    const offset = (page - 1) * limit;
    const order = orderBy ? `ORDER BY "${orderBy}" ${orderDir}` : 'ORDER BY 1';
    const [data, count] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(`SELECT * FROM "${tableName}" ${order} LIMIT ${limit} OFFSET ${offset}`),
      this.prisma.$queryRawUnsafe<any[]>(`SELECT COUNT(*) as total FROM "${tableName}"`),
    ]);
    return { data, total: parseInt(count[0].total), page, limit, totalPages: Math.ceil(parseInt(count[0].total) / limit) };
  }

  async getERDData() {
    const tables = await this.getAllTables();
    const relations = await this.prisma.$queryRaw<any[]>`
      SELECT tc.table_name AS source_table, kcu.column_name AS source_column,
        ccu.table_name AS target_table, ccu.column_name AS target_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      ORDER BY tc.table_name
    `;
    const tableColumns: Record<string, any[]> = {};
    for (const t of tables as any[]) {
      tableColumns[t.table_name] = await this.getTableColumns(t.table_name);
    }
    return { tables, relations, tableColumns };
  }
}
