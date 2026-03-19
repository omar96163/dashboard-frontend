export function formatErrorMessage(error) {
  if (error.response) {
    const data = error.response.data;

    if (Array.isArray(data.message || data.error)) {
      return data.message[0].msg || data.error[0].msg || "Validation error";
    }

    if (typeof data.error === "string") {
      return data.error;
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  if (error.request) {
    return "Network error. Please check your connection.";
  }

  return error.message || "An unexpected error occurred";
}
