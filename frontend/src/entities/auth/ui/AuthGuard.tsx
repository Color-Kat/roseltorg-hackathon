"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";

import { useAuthStore } from "@/entities/auth/lib";
import { ROUTES } from "@/shared/consts";
import { PageLoader } from "@/shared/ui/loaders/PageLoader";

type AuthGuardProps = PropsWithChildren<{
    /** Render children only for authenticated users (default). */
    authOnly?: boolean;
    /** Render children only for guests (e.g. login/register pages). */
    guestOnly?: boolean;
    /** Where to send users who fail the check. */
    redirectTo?: string;
}>;

/**
 * Client-side route guard. Reads the MobX auth store and redirects when the
 * auth requirement isn't met. While the session is being restored it shows a
 * loader to avoid a flash of the wrong content.
 */
export const AuthGuard: FC<AuthGuardProps> = observer(({
    children,
    authOnly = true,
    guestOnly = false,
    redirectTo,
}) => {
    const auth = useAuthStore();
    const router = useRouter();

    const wantsAuth = authOnly && !guestOnly;
    const passes = guestOnly ? !auth.isAuth : auth.isAuth || !wantsAuth;

    useEffect(() => {
        if (auth.isLoading) return;
        if (passes) return;

        router.replace(redirectTo ?? (guestOnly ? ROUTES.HOME : ROUTES.AUTH_LOGIN));
    }, [auth.isLoading, passes, guestOnly, redirectTo, router]);

    if (auth.isLoading) return <PageLoader />;
    if (!passes) return <PageLoader />;

    return <>{children}</>;
});

export default AuthGuard;
