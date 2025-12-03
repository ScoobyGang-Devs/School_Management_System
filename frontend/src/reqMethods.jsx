async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const response = await fetch("http://127.0.0.1:8000/tokenrefresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      // Refresh token expired or invalid
      return null;
    }

    const data = await response.json();
    localStorage.setItem("access", data.access);
    return data.access;

  } catch (err) {
    return null;
  }
}

// -----------------------------
// BASE REQUEST FUNCTION
// Handles retry logic
// -----------------------------
async function request(method, url, body = null, customHeaders = {}, retry = true) {
  try {
    const access = localStorage.getItem("access");

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: access ? `Bearer ${access}` : "",
        ...customHeaders,
      },
      body: body ? JSON.stringify(body) : null,
    });

    // Access token expired → backend returns 401
    if (response.status === 401 && retry) {
      const newAccess = await refreshToken();

      if (newAccess) {
        // Retry once with new token
        return request(method, url, body, customHeaders, false);
      } else {
        // Refresh token also expired → force logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // Optional: redirect to login
        window.location.href = "/login";

        throw new Error("Session expired. Please log in again.");
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Some responses have empty body
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 0) {
      return await response.json();
    }

    return { success: true };

  } catch (error) {
    throw error;
  }
}

// -----------------------------
// PUBLIC METHODS
// -----------------------------

const GET = (destination, data, headers = {}) =>
  request("GET", `${destination}/${data}/`, null, headers);

const POST = (destination, data, headers = {}) =>
  request("POST", destination, data, headers);

const PUT = (destination, data, headers = {}) =>
  request("PUT", destination, data, headers);

const PATCH = (destination, data, headers = {}) =>
  request("PATCH", destination, data, headers);

const DELETE = (destination, headers = {}) =>
  request("DELETE", destination, null, headers);

export default {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  refreshToken,
};
