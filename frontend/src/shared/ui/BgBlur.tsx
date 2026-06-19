import React, { FC, ReactNode } from 'react';
import { twMerge } from "tailwind-merge";

type BgBlurProps = {
    children: ReactNode;
    className?: string;
}

export const BgBlur: FC<BgBlurProps> = ({
    children,
    className
}) => {


    return (
        <div className={twMerge(
            "absolute inset-0 bg-black/30 size-full flex-center backdrop-blur-md pb-[70px]",
            className
        )}>
            {children}
        </div>
    );
}