'use client';

import { collectDeviceInfo, DeviceInfo } from "@/shared/lib/adaptability/collect-device-info";
import { useSyncExternalStore } from 'react';

/**
 * Create store for device detection
 */
function createDeviceStore() {
    let cache: DeviceInfo | null = null;
    const listeners = new Set<() => void>();

    function getSnapshot(): DeviceInfo {
        if (cache) return cache;

        const userAgent = navigator.userAgent;
        const device = collectDeviceInfo(userAgent);

        // Check touch support
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        cache = {
            ...device,
            isTouch,
        };

        return cache;
    }

    function subscribe(callback: () => void) {
        listeners.add(callback);
        return () => listeners.delete(callback);
    }

    function notify() {
        cache = null; // Invalidate cache
        listeners.forEach(listener => listener());
    }

    return { getSnapshot, subscribe, notify };
}

// Singleton store
const deviceStore = typeof window !== 'undefined' ? createDeviceStore() : null;

const SERVER_SNAPSHOT: DeviceInfo = {
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isTouch: true,
    isIOS: true,
    isAndroid: false,
};

/**
 * Client hook for device info detection.
 * Use useSyncExternalStore for proper hydration.
 */
export function useDeviceInfo(): DeviceInfo {
    const getServerSnapshot = () => SERVER_SNAPSHOT;

    const deviceInfo = useSyncExternalStore(
        deviceStore?.subscribe || (() => () => {}),
        deviceStore?.getSnapshot || getServerSnapshot,
        getServerSnapshot
    );

    return deviceInfo;
}