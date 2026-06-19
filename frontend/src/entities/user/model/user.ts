/**
 * Authenticated user, as returned by the backend (`GET /auth/me`,
 * and inside the auth token response). Extend this to match your API.
 */
export interface User {
    id: number;
    email: string;
    created_at: string;
}
