export type BookStatus =
  | "WISHLIST"
  | "PLAN_TO_READ"
  | "READING"
  | "PAUSED"
  | "DROPPED"
  | "READ"
  | "RECOMMENDED";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnailUrl?: string;
  status: BookStatus; 
  googleBookId?: string; 
}