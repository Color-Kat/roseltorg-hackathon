'use client';

import { Context, createContext, useContext } from "react";

/**
 * A hook that returns the value of a context. If the value is null, it throws an error.
 * @param context
 */
export function useStrictContext<T>(context: Context<T | null>) {
    const value = useContext(context);
    if (value === null) throw new Error("Strict context: context value not passed");
    return value as T;
}

export function createStrictContext<T>() {
    return createContext<T | null>(null);
}