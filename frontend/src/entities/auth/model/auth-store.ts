import { makeAutoObservable, runInAction } from "mobx";

import { authApi, Credentials } from "@/entities/auth/api";
import { User } from "@/entities/user";
import {
    getStoredAuthToken,
    setAuthToken,
} from "@/shared/api/api-instanse";
import { queryClient } from "@/shared/api/query-client";

/**
 * Client-side authentication store (MobX).
 *
 * Holds the current user + JWT access token. The token is mirrored into the
 * axios instance and localStorage via {@link setAuthToken}, so it is attached
 * to every request and survives page reloads.
 */
export class AuthStore {
    user: User | null = null;
    token: string | null = null;

    /** True while the initial session restore (hydrate) is in progress. */
    isLoading: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    get isAuth(): boolean {
        return !!this.user;
    }

    private setSession(token: string, user: User) {
        setAuthToken(token);
        runInAction(() => {
            this.token = token;
            this.user = user;
        });
    }

    /**
     * Restore a session from a previously stored token (call once on mount).
     */
    async hydrate() {
        const token = getStoredAuthToken();

        if (!token) {
            runInAction(() => (this.isLoading = false));
            return;
        }

        setAuthToken(token);
        runInAction(() => (this.token = token));

        try {
            const user = await authApi.me();
            runInAction(() => (this.user = user));
        } catch {
            // Token is invalid/expired — drop it.
            setAuthToken(null);
            runInAction(() => {
                this.token = null;
                this.user = null;
            });
        } finally {
            runInAction(() => (this.isLoading = false));
        }
    }

    async login(credentials: Credentials) {
        const res = await authApi.login(credentials);
        this.setSession(res.access_token, res.user);
    }

    async register(credentials: Credentials) {
        const res = await authApi.register(credentials);
        this.setSession(res.access_token, res.user);
    }

    logout() {
        setAuthToken(null);
        runInAction(() => {
            this.user = null;
            this.token = null;
        });
        queryClient.clear();
    }
}
