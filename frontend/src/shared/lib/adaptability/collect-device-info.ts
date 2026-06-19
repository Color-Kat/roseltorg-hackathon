export interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouch: boolean;
    isIOS: boolean;
    isAndroid: boolean;
}

/**
 * Util for parsing User-Agent
 * Can be used both on server and client sides
 */
export function collectDeviceInfo(userAgent: string): Omit<DeviceInfo, 'isTouch'> {
    const ua = userAgent.toLowerCase();

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
    const isTablet = /tablet|ipad|playbook|silk/i.test(ua) && !isMobile;
    const isDesktop = !isMobile && !isTablet;

    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);

    return {
        isMobile,
        isTablet,
        isDesktop,
        isIOS,
        isAndroid,
    };
}