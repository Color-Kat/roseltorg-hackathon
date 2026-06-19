import { api } from "@/shared/api/api-instanse";
import { User } from "@/entities/user";

export interface Credentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

/**
 * Auth endpoints. Matches the FastAPI backend (see backend/app/routers/auth.py).
 */
export const authApi = {
    /** Register a new user. Returns an access token + the created user. */
    register: async (dto: Credentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>("/auth/register", dto);
        return data;
    },

    /** Log in with email + password. Returns an access token + the user. */
    login: async (dto: Credentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>("/auth/login", dto);
        return data;
    },

    /** Get the currently authenticated user (requires a valid bearer token). */
    me: async (): Promise<User> => {
        const { data } = await api.get<User>("/auth/me");
        return data;
    },
};
