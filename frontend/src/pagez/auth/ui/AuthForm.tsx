'use client';

import { Button, Card, CardBody, Input } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useAuthStore } from "@/entities/auth";
import { getErrorFromResponse } from "@/shared/api/errors";
import { ROUTES } from "@/shared/consts";

type Mode = "login" | "register";

const COPY: Record<Mode, { title: string; submit: string; switchText: string; switchHref: string; switchLabel: string }> = {
    login: {
        title     : "Log in",
        submit    : "Log in",
        switchText: "No account yet?",
        switchHref: ROUTES.AUTH_REGISTER,
        switchLabel: "Register",
    },
    register: {
        title     : "Create account",
        submit    : "Register",
        switchText: "Already have an account?",
        switchHref: ROUTES.AUTH_LOGIN,
        switchLabel: "Log in",
    },
};

export const AuthForm = ({ mode }: { mode: Mode }) => {
    const auth = useAuthStore();
    const router = useRouter();
    const copy = COPY[mode];

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (mode === "login") {
                await auth.login({ email, password });
            } else {
                await auth.register({ email, password });
            }
            router.replace(ROUTES.HOME);
        } catch (err) {
            setError(getErrorFromResponse(err).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-dvh items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardBody className="gap-4">
                    <h1 className="text-xl font-semibold">{copy.title}</h1>

                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
                        <Input
                            type="email"
                            label="Email"
                            value={email}
                            onValueChange={setEmail}
                            isRequired
                        />
                        <Input
                            type="password"
                            label="Password"
                            value={password}
                            onValueChange={setPassword}
                            isRequired
                        />

                        {error && <p className="text-sm text-danger">{error}</p>}

                        <Button type="submit" color="primary" isLoading={loading}>
                            {copy.submit}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-default-500">
                        {copy.switchText}{" "}
                        <Link href={copy.switchHref} className="text-primary">
                            {copy.switchLabel}
                        </Link>
                    </p>
                </CardBody>
            </Card>
        </main>
    );
};
