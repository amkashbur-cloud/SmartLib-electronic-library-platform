export type Role = "student" | "researcher" | "admin";
export type AccountStatus = "active" | "suspended";

export type ResourceType =
  | "E-Book"
  | "Research Paper"
  | "Thesis"
  | "Journal Article"
  | "Lecture Material"
  | "Educational Resource";

export type AccessType = "Open Access" | "Licensed" | "Restricted" | "Demo";

export type Language = "English" | "Arabic";

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: Role;
  account_status: AccountStatus;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  biography: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: ResourceType;
  author_id: string;
  category_id: string;
  isbn: string;
  publication_year: number;
  language: Language;
  cover_color: string;
  file_url: string;
  access_type: AccessType;
  featured: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
}

export interface ReadingHistoryEntry {
  id: string;
  user_id: string;
  resource_id: string;
  progress: number; // 0-100
  last_page: number;
  reading_time: number; // minutes
  last_accessed: string;
}

export interface ReadingList {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface ReadingListItem {
  id: string;
  reading_list_id: string;
  resource_id: string;
  added_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  resource_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
}

export interface DownloadEvent {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
}

export interface PublicUser {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  account_status: AccountStatus;
  created_at: string;
}

export function toPublicUser(u: User): PublicUser {
  return {
    id: u.id,
    full_name: u.full_name,
    email: u.email,
    role: u.role,
    account_status: u.account_status,
    created_at: u.created_at,
  };
}

export interface ApiError {
  error: string;
  message: string;
}
