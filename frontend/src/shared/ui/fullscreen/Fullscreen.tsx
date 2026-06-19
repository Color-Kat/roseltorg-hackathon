'use client';

import { FC, PropsWithChildren } from 'react';

type FullscreenProps = PropsWithChildren;

export const Fullscreen: FC<FullscreenProps> = ({ children }) => {
    return (
        <div className="fixed inset-0 z-30 bg-layout">
            {children}
        </div>
    );
}