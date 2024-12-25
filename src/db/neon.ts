import { neon } from '@neondatabase/serverless';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import Folder from '../interfaces/Folder';
import { File } from '../interfaces/File';

async function getLatestFolders() {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`SELECT * from sni_folders order by creation_date desc`;
  return response;
}

export async function getFolders(uid : string) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`SELECT * from sni_folders where user_id = ${uid}`;
  return response;
}

export async function createFolder(folder:Folder,uid : string) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`INSERT INTO sni_folders (folder_id,user_id,folder_name,creation_date)
  VALUES (${folder.folder_id},${uid},${folder.folder_name},now())
  `;
  return response;
}

export async function getFiles(id : string, uid : string) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`SELECT * from sni_files where folder_id=${id} and user_id=${uid}`;
  return response;
}

export async function createFile(selectedFile : File, folder_id : string, uid : string) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`INSERT INTO sni_files (file_id,folder_id,user_id,file_name,creation_date)
  VALUES (${selectedFile.file_id},${folder_id},${uid},${selectedFile.file_name},now())
  `;
  return response;
}

export async function saveStateToDb(fileId : string,content: SerializedEditorState<SerializedLexicalNode>) {
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`UPDATE sni_files SET file_content = ${content}, last_updated_date=now() WHERE file_id = ${fileId}`;
  return response;
}

export async function deleteFile(file_id : string, uid : string){
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`DELETE from sni_files where user_id = ${uid} and file_id = ${file_id}`;
  return response;
}

export async function deleteFolder(folder_id : string, uid : string){
  const sql = neon(import.meta.env.VITE_DATABASE_URL || "");
  const response = await sql`DELETE from sni_folders where user_id = ${uid} and folder_id = ${folder_id}`;
  return response;
}


export default getLatestFolders