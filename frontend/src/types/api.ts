export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}

// export interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  filter?: Record<string, string | number | boolean | Array<string | number>>;
  populate?: string[];
  fields?: string[];
  startDate?: string;
  endDate?: string;
}

// Common query parameter combinations
export interface CourseQueryParams extends QueryParams {
  lecturer?: string;
  student?: string;
  status?: "active" | "archived";
}

export interface MaterialQueryParams extends QueryParams {
  courseId?: string;
  uploadedBy?: string;
  fileType?: string[];
}
