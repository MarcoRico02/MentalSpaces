// Error Service - Centralized error handling
export class ErrorService {
  static handleAuthError(error: any): string {
    if (error?.response?.status === 401) {
      return "Invalid credentials";
    }
    if (error?.response?.status === 403) {
      return "You don't have permission for this action";
    }
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    return "An unexpected error occurred";
  }

  static handleApiError(error: any): string {
    if (error?.response?.status) {
      const status = error.response.status;
      switch (status) {
        case 400:
          return "Invalid request data";
        case 401:
          return "Authentication required";
        case 403:
          return "Access denied";
        case 404:
          return "Resource not found";
        case 500:
          return "Server error occurred";
        default:
          return "Request failed";
      }
    }
    return "Network error occurred";
  }

  static showError(type: "error" | "warning" | "info", message: string): void {
    console.error(`[${type.toUpperCase()}] ${message}`);

    // Here you could add a toast notification library
    // toast.error(message);  // if using react-hot-toast
    // alert(message);        // as fallback
  }

  static showSuccess(message: string): void {
    console.log(`✅ ${message}`);

    // Here you could add a toast notification library
    // toast.success(message);
    // alert(message);         // as fallback
  }

  static showInfo(message: string): void {
    console.info(`ℹ️ ${message}`);

    // Here you could add a toast notification library
    // toast.info(message);
    // alert(message);         // as fallback
  }
}
