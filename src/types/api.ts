import type { Pagination } from './pagination';

/** Generic API response wrapper for successful responses */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/** API error response */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
  details?: Record<string, string[]>;
}

/** Paginated API response */
export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
  message?: string;
}
