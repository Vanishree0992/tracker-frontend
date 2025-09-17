import axios from "axios";

// Create a global axios instance
const API = axios.create({
  baseURL: "https://mini-project-tracker-backend.onrender.com/api/", // Django backend API
  timeout: 5000, // 5 seconds timeout
});
/* 
axios.create()
This creates a new Axios instance with default settings so you don’t have to repeat them every time you make a request.

baseURL
Sets the base URL for all requests made using this instance.
Here it's pointing to our Django backend’s API at http://127.0.0.1:8000/api/.
You only need to specify the endpoint paths when making requests (e.g., "register/", "login/").

timeout
If a request takes longer than 5000 milliseconds (5 seconds), it will be automatically canceled and throw an error
*/


// Request interceptor to attach access token
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
/* 
Before any request is sent, this function is called with the Axios request config.
It retrieves the access_token stored in the browser’s localStorage.

If the token is available, it adds an Authorization header to the request.
The header is formatted as Bearer <access_token> which is required by many APIs (including Django REST Framework with JWT).

After attaching the token, it returns the modified config to proceed with the request.
If an error occurs while setting up the request, it rejects the promise with the error, so it can be handled later.
*/

// Response interceptor for token refresh
// Setting up the interceptor
API.interceptors.response.use(
  (response) => response,

  // Handling errors
  async (error) => {
    const originalRequest = error.config;
    
    // Checking for expired token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Getting the refresh token
      try {
        const refreshToken = localStorage.getItem("refresh_token");

        // Requesting a new access token
        if (refreshToken) {
          const { data } = await axios.post("https://mini-project-tracker-backend.onrender.com/api/users/token/refresh/", {
            refresh: refreshToken,
          });

          // Storing the new access token
          localStorage.setItem("access_token", data.access);
          originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

          // Retrying the original request
          return axios(originalRequest);
        }
      } // Handling refresh failure
        catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // redirect to login
      }
    }

    // Return the error if it's not handled
    return Promise.reject(error);
  }
);

/* 
Setting up the interceptor
Every successful response is passed through without change.
This means if the request is fine, it will just return the response.

Handling errors
If the request fails, this block is triggered.
error.config contains the original request details (URL, headers, method, etc.).
We're saving it so we can retry later.

Checking for expired token
Checks if:
The error is a server response (not a network error).
The status code is 401 (unauthorized → likely because of an expired token).
The request hasn’t been retried yet (_retry ensures it’s only attempted once).
Setting originalRequest._retry = true prevents endless retry loops.

Getting the refresh token
Retrieves the refresh token from the browser's local storage.
If no token is present, it skips this process (and the request will eventually fail).

Requesting a new access token
Sends a POST request to the backend's refresh endpoint.
The refresh token is sent in the body.
If valid, the server responds with a new access token.

Storing the new access token
The new token is saved in local storage.
The original request's headers are updated with this new token.

Retrying the original request
The original request is retried using the new access token.
This retry is seamless and transparent to the user.

Handling refresh failure
If refreshing fails (maybe the refresh token expired or is invalid):
Both tokens are removed from local storage for security.
The user is redirected to the login page to re-authenticate.

Returning the error if it’s not handled
If the error is not a 401 or if retrying didn't succeed, the error is propagated to the place where the request was made.
This allows other parts of your app to handle it if needed.
*/

export default API;
