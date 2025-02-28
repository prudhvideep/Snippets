import { Json } from "./database.types";

export type Folder = {
  folder_id: string;
  folder_name: string;
  is_favourite: boolean;
  is_expanded?: boolean;
};

export type File = {
  file_id: string;
  file_name: string | null;
  file_data: Json | null;
  folder_id: string | null;
  is_pinned: boolean | null;
};
