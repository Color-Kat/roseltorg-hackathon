'use client';

import { Button, Card, CardBody } from "@heroui/react";
import { observer } from "mobx-react-lite";
import Link from "next/link";

import { useAuthStore } from "@/entities/auth";
import { ROUTES } from "@/shared/consts";

/**
 * Shows the current auth state from the MobX store and lets the user
 * log in / out. Demonstrates wiring observer components to the store.
 */
export const AuthStatus = observer(() => {
    const auth = useAuthStore();

    return (
        <Card className="w-full max-w-md">
            <CardBody className="gap-4">
                <h2 className="text-lg font-semibold">Auth (MobX demo)</h2>

                {auth.isLoading ? (
                    <p className="text-sm text-default-500">Checking session…</p>
                ) : auth.isAuth ? (
                    <div className="flex items-center justify-between">
                        <span className="text-sm">
                            Signed in as <b>{auth.user?.email}</b>
                        </span>
                        <Button size="sm" variant="flat" onPress={() => auth.logout()}>
                            Log out
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button as={Link} href={ROUTES.AUTH_LOGIN} color="primary" size="sm">
                            Log in
                        </Button>
                        <Button as={Link} href={ROUTES.AUTH_REGISTER} variant="flat" size="sm">
                            Register
                        </Button>
                    </div>
                )}
            </CardBody>
        </Card>
    );
});
