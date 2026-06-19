'use client'
import { AuthStoreContext } from "@/entities/auth/model/auth-store-context";
import { useStrictContext } from "@/shared/lib/react";

export function useAuthStore() {
    return useStrictContext(AuthStoreContext);
}