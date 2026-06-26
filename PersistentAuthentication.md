# Persistent Authentication in Vybe

Persistent authentication is a mechanism that allows users to remain logged in to a web application even after they close the browser tab or window. Without it, users would need to re-enter their username and password every time they revisit the app. 

In your **Vybe** application, persistent authentication is implemented using a combination of **JWT (JSON Web Tokens)**, **HttpOnly Cookies**, and **Browser LocalStorage**. 

Here is a step-by-step breakdown of how this is implemented across your frontend and backend:

## 1. Backend: Token Generation and Cookie Assignment
When a user signs in or signs up (`backend/controllers/auth.controllers.js`), the following happens:
*   **Token Creation:** A JWT (JSON Web Token) is generated for the authenticated user using `genToken(user._id)`.
*   **HttpOnly Cookie:** The backend attaches this token to an `HttpOnly` cookie. This is a very secure method because `HttpOnly` cookies cannot be accessed or stolen by malicious client-side JavaScript (protecting against XSS attacks).
*   **Persistence Configuration:** The cookie is given a `maxAge` of 10 years (`10*365*24*60*60*1000`), ensuring it remains in the user's browser for a very long time unless they explicitly sign out. 
*   **Response:** The backend also returns the token inside the JSON response body.

## 2. Frontend: LocalStorage Persistence
When the login request succeeds in the frontend (`frontend/src/pages/SignIn.jsx`):
*   **Storing the Token:** The frontend takes the token from the JSON response and stores it in the browser's `localStorage` under the key `'auth_token'`. This provides a secondary layer of token storage.

## 3. Frontend: Automatic Request Interception
To ensure the user remains authenticated on subsequent API calls, your API configuration (`frontend/src/config/apiConfig.js`) does two important things:
*   **`withCredentials: true`**: The default Axios instance is configured with this flag. It tells the browser to automatically include the `HttpOnly` cookie (set by the backend) in every API request sent to the server.
*   **Axios Interceptor**: An interceptor is set up to run before every outgoing request. It checks if there is an `'auth_token'` in `localStorage`. If it finds one, it automatically attaches it to the request's `Authorization` header as a `Bearer` token. 

*Note: You are currently using a dual-layered approach where both the Cookie and the Bearer token are being sent. Usually, relying on just the `HttpOnly` cookie is the most secure approach.*

## 4. App Initialization: The `getCurrentUser` Hook
The most crucial part of persistent authentication happens when the user revisits the app or reloads the page.
*   In your main `App.jsx`, the custom hook `getCurrentUser()` (`frontend/src/hooks/getCurrentUser.jsx`) is called immediately.
*   This hook fires a request to the backend route `/api/user/current`.
*   Because of the Axios configuration mentioned above, the browser automatically sends the stored token/cookie to the server.
*   If the token is valid, the server recognizes the user and returns their profile data. The frontend then saves this data into the Redux state (`dispatch(setUserData(result.data))`), effectively "logging them in" automatically without any manual input.
*   If the token is invalid or expired, the hook catches the error and cleans up by removing the invalid `'auth_token'` from `localStorage`.

## Summary
By combining **secure, long-lived backend cookies** with **frontend interceptors** and an **initialization hook** (`getCurrentUser`), Vybe seamlessly restores the user's session every time they open the app, providing a smooth and uninterrupted user experience.
