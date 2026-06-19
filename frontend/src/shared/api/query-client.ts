import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const queryClient = new QueryClient({
    //

});

/**
 * Create a new QueryClient instance for server-side use.
 * Each server request should have its own QueryClient.
 */
export const getServerQueryClient = cache(() => new QueryClient())