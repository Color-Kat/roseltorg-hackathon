import { Button } from "@heroui/button";
import React, { FC } from 'react';
import { twJoin } from "tailwind-merge";

export const SquareButton: FC<{
    children: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
}> = ({ children, ariaLabel, disabled, onPress }) => {
    return (
        <Button
            isIconOnly
            aria-label={ariaLabel}
            className={twJoin(
                "size-14 bg-white disabled:bg-gray-300 shadow-lg/50 text-primary-green rounded-3xl pointer-events-auto",
                "starting:opacity-0 starting:scale-90 opacity-100 scale-100 transition-all duration-500",
                "ending:opacity-0 ending:scale-90",
            )}
            disabled={disabled}
            type="button"
            onPress={onPress}
        >
            {children}
        </Button>
    );
};