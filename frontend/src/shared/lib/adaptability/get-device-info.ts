'use server';
import { collectDeviceInfo, DeviceInfo } from "./collect-device-info";
import { headers } from 'next/headers';

/**
 * Server function to detect device info by User-Agent.
 * Use only in Server Components
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    const device = collectDeviceInfo(userAgent);

    // On server suppose isTouch = true for mobile and tablet devices
    const isTouch = device.isMobile || device.isTablet || device.isIOS || device.isAndroid;

    return {
        ...device,
        isTouch,
    };
}