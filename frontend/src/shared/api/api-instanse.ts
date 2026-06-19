import axios, { AxiosInstance } from "axios";

/**
 * Base URL of the backend API.
 * Configured via NEXT_PUBLIC_API_URL (see .env), falls back to local backend.
 */
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const TOKEN_STORAGE_KEY = "access_token";

/**
 * Global axios client used across the app.
 *
 * Auth: a JWT access token is attached as `Authorization: Bearer <token>`.
 * The token is managed by the auth store (see entities/auth) and mirrored here
 * via {@link setAuthToken} so every request — including those made outside React —
 * is authenticated.
 */
export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
    },
});

/**
 * Set (or clear) the bearer token used for all subsequent requests.
 * Also persists it to localStorage so the session survives page reloads.
 */
export function setAuthToken(token: string | null) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        if (typeof window !== "undefined") {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        }
    } else {
        delete api.defaults.headers.common.Authorization;
        if (typeof window !== "undefined") {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    }
}

/**
 * Read a previously persisted token from localStorage (client only).
 */
export function getStoredAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}
