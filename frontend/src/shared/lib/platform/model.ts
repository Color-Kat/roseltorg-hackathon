export type Platform = 'android' | 'ios' | 'web';

export const PLATFORMS = {
    ANDROID: 'android',
    IOS    : 'ios',
    WEB    : 'web',
} as const;

export function mapUserAgentToPlatform(userAgent: string): Platform {
    if (userAgent.includes('AndroidApp')) return PLATFORMS.ANDROID;
    if (userAgent.includes('IosApp')) return PLATFORMS.IOS;
    return PLATFORMS.WEB;
}