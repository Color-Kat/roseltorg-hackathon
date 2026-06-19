'use client';

import { Button } from "@heroui/button";
import { FaXmark } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { useBackButton } from "../lib/use-back-button";

interface CloseButtonProps {
    backUrl?: string;
    fallbackUrl?: string;
    className?: string;
}

export const CloseButton = ({
    backUrl,
    fallbackUrl,
    className
}: CloseButtonProps) => {
    const { handleBack } = useBackButton({ backUrl, fallbackUrl });

    return (
        <Button
            isIconOnly
            onPress={handleBack}
            variant="light"
            color="secondary"
            radius="full"
            className={twMerge(
                'bg-black/40 backdrop-blur-lg border border-black/20 shadow-lg',
                className
            )}
            aria-label="Закрыть"
        >
            <FaXmark className="text-gray-300 text-2xl"/>
        </Button>
    );
};

