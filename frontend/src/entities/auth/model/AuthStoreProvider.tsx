'use client';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';

import { AuthStore } from './auth-store';
import { AuthStoreContext } from '@/entities/auth/model/auth-store-context';

/**
 * Provides a single AuthStore instance to the React tree and restores the
 * session from a stored token on mount.
 */
export const AuthStoreProvider: FC<PropsWithChildren> = ({ children }) => {
    const storeRef = useRef<AuthStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = new AuthStore();
    }

    useEffect(() => {
        // Restore session from the persisted token (if any).
        storeRef.current?.hydrate();
    }, []);

    return (
        <AuthStoreContext.Provider value={storeRef.current}>
            {children}
        </AuthStoreContext.Provider>
    );
};
