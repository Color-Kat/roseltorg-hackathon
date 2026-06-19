'use client';

import { Button } from "@heroui/button";
import { FaAngleLeft } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { useBackButton } from "../lib/use-back-button";

interface CircleBackButtonProps {
    backUrl?: string;
    fallbackUrl?: string;
    className?: string;
}

export const CircleBackButton = ({ 
    backUrl, 
    fallbackUrl,
    className = ""
}: CircleBackButtonProps) => {
    const { handleBack } = useBackButton({ backUrl, fallbackUrl });

    return (
        <Button 
            isIconOnly
            onPress={handleBack}
            variant="solid"
            className={twMerge(
                'size-11 bg-stone-100 hover:bg-stone-200',
                className
            )}
            radius="full"
            aria-label="Назад"
        >
            <FaAngleLeft className="text-title-black text-xl stroke-7" />
        </Button>
    );
};
