import { neon } from '@neondatabase/serverless';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import Folder from '../interfaces/Folder';

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

export async function createFolder(folder:Folder) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`INSERT INTO sni_folders (folder_id,user_id,folder_name,creation_date)
  VALUES (${folder.folder_id},1,${folder.folder_name},now())
  `;
  return response;
}

export async function getFiles(id : number) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`SELECT * from sni_files where folder_id=${id}`;
  return response;
}

export async function saveStateToDb(fileId : number,content: SerializedEditorState<SerializedLexicalNode>) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`UPDATE sni_files SET file_content = ${content}, last_edited=now() WHERE file_id = ${fileId}`;
  return response;
}

export default getLatestFolders