'use client';

import { mapUserAgentToPlatform } from "@/shared/lib/platform/model";

export const getPlatform = () => {
    return mapUserAgentToPlatform(navigator.userAgent);
}