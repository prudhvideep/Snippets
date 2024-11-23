import { neon } from '@neondatabase/serverless';

async function getLatestFolders() {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`SELECT * from sni_folders order by creation_date desc`;
  return response;
}

export async function getFolders() {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`SELECT * from sni_folders`;
  return response;
}

export async function getFiles(id : number) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`SELECT * from sni_files where folder_id=${id}`;
  return response;
}

export default getLatestFolders