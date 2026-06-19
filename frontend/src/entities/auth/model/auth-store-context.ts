'use client'
import { AuthStore } from "./auth-store";
import { createStrictContext } from "@/shared/lib/react";

export const AuthStoreContext = createStrictContext<AuthStore>();
