// auth utility for managing access tokens and refresh tokens
// this file provides functions for storing, retrieving, and managing jwt tokens

// key for storing access token in local storage
// access tokens are short-lived (typically 5-15 minutes)
// used to authenticate api requests
const ACCESS_TOKEN_KEY = "access_token";

// key for storing refresh token in local storage
// refresh tokens are long-lived (typically 7-30 days)
// used to obtain new access tokens when they expire
const REFRESH_TOKEN_KEY = "refresh_token";

// stores both access and refresh tokens in local storage
// called after successful login or token refresh
// param: accessToken - the short-lived jwt for api requests
// param: refreshToken - the long-lived jwt for refreshing access tokens
export function setTokens(accessToken, refreshToken) {
    // stores the access token in local storage
    // this token will be sent in the authorization header for api requests
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    // stores the refresh token in local storage
    // this token is used to get new access tokens when they expire
    // note: in production, consider using httpOnly cookies for refresh tokens
    // as they are more secure and not accessible via javascript
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

// retrieves the access token from local storage
// returns: the access token string or null if not found
// used when making authenticated api requests
export function getAccessToken() {
    // attempts to get the access token from local storage
    // returns null if the token doesn't exist
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// retrieves the refresh token from local storage
// returns: the refresh token string or null if not found
// used when requesting a new access token
export function getRefreshToken() {
    // attempts to get the refresh token from local storage
    // returns null if the token doesn't exist
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// removes both tokens from local storage
// called when user logs out or when tokens are invalid
// this effectively signs the user out of the application
export function clearTokens() {
    // removes the access token from local storage
    // without this, api requests will fail with 401 unauthorized
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    // removes the refresh token from local storage
    // prevents the ability to get new access tokens
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// checks if the user has valid tokens (is logged in)
// returns: boolean indicating if an access token exists
// note: this doesn't verify if the token is expired - just if it exists
export function isAuthenticated() {
    // checks if an access token exists in local storage
    // returns true if token exists, false otherwise
    return getAccessToken() !== null;
}

// creates authorization headers for fetch requests
// returns: object with authorization header containing bearer token
// use this when making authenticated api calls
export function getAuthHeaders() {
    // gets the current access token
    const token = getAccessToken();

    // returns headers object with bearer token
    // the 'bearer' prefix indicates the token type
    // servers expect: "Authorization: Bearer <token>"
    return {
        // content type for json requests
        "Content-Type": "application/json",
        // authorization header with bearer token
        // only include if token exists
        ...(token ? { "Authorization": `Bearer ${token}` } : {}) // conditionally adds the Authorization header if token exists
    };
}

// decodes a jwt token to extract its payload
// param: token - the jwt token string
// returns: the decoded payload object or null if invalid
// useful for checking token expiration without server call
// we need to decodeToken because the jwt token contains the expiration time in its payload (exp field)
export function decodeToken(token) {
    // returns null if no token provided
    if (!token) return null;

    try {
        // jwt tokens have three parts separated by dots
        // format: header.payload.signature
        // we only need the payload (second part)
        const base64Url = token.split('.')[1];

        // replaces url-safe characters with standard base64 characters
        // + becomes -, / becomes _, = becomes empty string
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // decodes the base64 string to get the json payload
        // atob decodes base64, then decodeuri handles utf-8 characters
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        // parses the json string into a javascript object
        return JSON.parse(jsonPayload);
    } catch (error) {
        // returns null if decoding fails (invalid token format)
        // this could happen with malformed or corrupted tokens
        return null;
    }
}

// checks if an access token is expired or about to expire
// param: token - optional token to check, uses stored token if not provided
// returns: boolean indicating if token is expired
export function isTokenExpired(token = null) {
    // uses the provided token or gets the stored access token
    const tokenToCheck = token || getAccessToken();

    // returns true if no token exists
    if (!tokenToCheck) return true;

    // decodes the token to get its payload
    const decoded = decodeToken(tokenToCheck);

    // returns true if decoding failed
    if (!decoded) return true;

    // gets the expiration timestamp from the token
    // jwt stores expiration as 'exp' in seconds since epoch
    const expirationTime = decoded.exp;

    // gets current time in seconds since epoch
    const currentTime = Math.floor(Date.now() / 1000);

    // returns true if current time is past the expiration time
    // adds a 30 second buffer to refresh before actual expiration
    // this prevents requests from failing due to timing issues
    return currentTime >= expirationTime - 30;
}
