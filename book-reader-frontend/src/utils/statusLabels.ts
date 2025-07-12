import { BookStatus } from "../types/Book";

export const statusLabels: Record<BookStatus, string> = {
  PLAN_TO_READ: "Plan to Read",
  READING: "Reading",
  PAUSED: "Paused",
  READ: "Read",
  DROPPED: "Dropped",
  RECOMMENDED: "Recommended",
};
