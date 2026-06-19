'use client';

import { Button, ButtonProps } from "@heroui/button";
import { FC } from 'react';
import { twMerge } from "tailwind-merge";

export const GreenButton: FC<ButtonProps> = (props) => {
    return (
        <Button
            variant="shadow"
            color="primary"
            size="lg"
            {...props}
            className={twMerge(
                "bg-primary-green text-white",
                props.className,
            )}
        >
            {props.children}
        </Button>
    );
}