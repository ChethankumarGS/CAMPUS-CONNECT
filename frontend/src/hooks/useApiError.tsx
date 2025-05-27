import { useState, useCallback } from "react";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      const axiosError = err as AxiosError<ApiErrorResponse>;

      // Get the error message from the API response if available
      const apiMessage = axiosError.response?.data?.message;
      // const statusCode = axiosError.response?.status;

      const displayMessage = apiMessage || err.message || "An error occurred";

      // Set the error state
      setError(displayMessage);

      // // Log the error for debugging
      // console.error("API Error:", {
      //   message: displayMessage,
      //   status: statusCode,
      //   error: err,
      // });
    } else {
      // Handle non-Error objects
      const fallbackMessage = "An unexpected error occurred";
      setError(fallbackMessage);
      console.error("Unknown error:", err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
