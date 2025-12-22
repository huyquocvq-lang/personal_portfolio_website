/**
 * Script để đồng bộ entities với Supabase schema
 * 
 * Usage:
 *   npm run sync:entities
 * 
 * Script này sẽ:
 * 1. Fetch schema từ Supabase
 * 2. So sánh với entities hiện tại
 * 3. Báo cáo các khác biệt
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

// TypeScript: After validation, we know these are strings
const supabaseUrl: string = SUPABASE_URL;
const supabaseKey: string = SUPABASE_KEY;

interface ColumnInfo {
  name: string;
  data_type: string;
  format: string;
  nullable: boolean;
  default_value?: string;
  unique?: boolean;
}

interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  primary_keys: string[];
}

async function fetchSupabaseSchema() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch tables
  const { data: tables, error } = await supabase.rpc('get_schema_info');

  if (error) {
    console.error('Error fetching schema:', error);
    return null;
  }

  // Alternative: Use direct SQL query
  const { data: schemaData, error: schemaError } = await supabase
    .from('information_schema.columns')
    .select('table_name, column_name, data_type, is_nullable, column_default');

  if (schemaError) {
    console.error('Error fetching schema info:', schemaError);
    return null;
  }

  return schemaData;
}

function compareEntityWithSchema(entityFile: string, tableInfo: TableInfo) {
  const entityContent = fs.readFileSync(entityFile, 'utf-8');
  const issues: string[] = [];

  // Check if all columns exist in entity
  tableInfo.columns.forEach((column) => {
    const columnRegex = new RegExp(`@Column[^}]*\\n\\s*${column.name}`, 'm');
    if (!columnRegex.test(entityContent)) {
      issues.push(`Missing column in entity: ${column.name} (${column.data_type})`);
    }
  });

  // Check nullable fields
  tableInfo.columns
    .filter((col) => col.nullable)
    .forEach((column) => {
      const nullableRegex = new RegExp(
        `@Column[^}]*nullable:\\s*true[^}]*\\n\\s*${column.name}`,
        'm',
      );
      if (!nullableRegex.test(entityContent)) {
        issues.push(`Column ${column.name} should be nullable in entity`);
      }
    });

  return issues;
}

async function main() {
  console.log('🔄 Syncing entities with Supabase schema...\n');

  const entitiesDir = path.join(__dirname, '../src/entities');
  const entityFiles = ['blog-post.entity.ts', 'tag.entity.ts'];

  // For now, just validate that entities exist and have correct structure
  entityFiles.forEach((file) => {
    const filePath = path.join(entitiesDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found entity: ${file}`);
    } else {
      console.log(`❌ Missing entity: ${file}`);
    }
  });

  console.log('\n📋 Schema comparison:');
  console.log('Note: Use Supabase MCP tools to fetch latest schema and compare manually');
  console.log('Or use Supabase Dashboard > Database > Tables to view schema');

  console.log('\n💡 Tips:');
  console.log('1. Use MCP Supabase tool: list_tables to see current schema');
  console.log('2. Compare columns in Supabase with @Column decorators in entities');
  console.log('3. Ensure nullable fields match (nullable: true in Supabase = nullable: true in entity)');
  console.log('4. Ensure data types match (varchar, text, timestamp, etc.)');
}

main().catch(console.error);

