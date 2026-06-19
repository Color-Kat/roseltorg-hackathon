'use client';

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren } from "react";

import { AuthStoreProvider } from "@/entities/auth";
import { queryClient } from "@/shared/api/query-client";

/**
 * Global client-side providers: React Query, HeroUI (with Next router
 * integration), toasts, and the MobX auth store.
 *
 * Add new client providers here.
 */
export const Providers: FC<PropsWithChildren> = ({ children }) => {
    const router = useRouter();

    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider navigate={router.push}>
                <AuthStoreProvider>
                    <ToastProvider placement="top-center" toastOffset={24} />
                    {children}
                </AuthStoreProvider>
            </HeroUIProvider>

            {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
};
