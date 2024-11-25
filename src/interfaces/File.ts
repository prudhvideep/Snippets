export interface File {
  file_id: string;
  file_name: string;
  lastEdited: string;
  fileContent : JSON | null;
}