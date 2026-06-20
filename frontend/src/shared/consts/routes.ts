export const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:8000';

/**
 * Central list of app routes. Add yours here and reference ROUTES.* everywhere
 * so links stay consistent and easy to refactor.
 */
export const ROUTES = {
    HOME: '/',

    AUTH_LOGIN   : '/auth/login',
    AUTH_REGISTER: '/auth/register',

    SIMULATOR: '/simulator',
} as const;
