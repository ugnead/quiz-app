export interface APIError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function isAPIError(error: unknown): error is APIError {
  return typeof error === "object" && error !== null && "response" in error;
}

export function getAPIErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    return error.response?.data?.message || "An unexpected error occurred.";
  }
  return "An unexpected error occurred.";
}
