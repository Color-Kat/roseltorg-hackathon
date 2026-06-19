'use client'
import { Button, ButtonProps } from "@heroui/button";
import { FC } from 'react';
import { twMerge } from "tailwind-merge";

export const WhiteButton: FC<ButtonProps> = (props) => {
    return (
        <Button
            variant="solid"
            {...props}
            className={twMerge(
                "bg-white font-medium shadow-button",
                props.className,
            )}
        >
            {props.children}
        </Button>
    );
}