export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message?: string;
    errors?: Record<string, any>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ErrorData {
    message?: string;
    errors?: Record<string, any>;
}