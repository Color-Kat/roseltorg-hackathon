import { getPlatform } from "@/shared/lib/platform/get-platform";
import { PLATFORMS } from "@/shared/lib/platform/model";

// True if site is running from native app webview
export const isMobileApp = getPlatform() == PLATFORMS.IOS || getPlatform() == PLATFORMS.ANDROID;