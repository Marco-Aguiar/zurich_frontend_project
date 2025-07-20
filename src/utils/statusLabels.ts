import { BookStatus } from "../types/Book";

export const statusLabels: Record<BookStatus, string> = {
  PLAN_TO_READ: "Plan to Read",
  READING: "Reading",
  PAUSED: "Paused",
  READ: "Read",
  DROPPED: "Dropped",
  RECOMMENDED: "Recommended",
};

export const STATUS_ORDER: BookStatus[] = [
  "PLAN_TO_READ",
  "READING",
  "PAUSED",
  "READ",
  "DROPPED",
  "RECOMMENDED",
];

export const ALL_POSSIBLE_STATUSES: BookStatus[] = Object.keys(
  statusLabels
) as BookStatus[];
