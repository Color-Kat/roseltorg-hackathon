'use client';

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ROUTES } from "@/shared/consts/routes";

interface UseBackButtonProps {
    backUrl?: string;
    fallbackUrl?: string;
}

export const useBackButton = ({ 
    backUrl, 
    fallbackUrl = ROUTES.HOME,
}: UseBackButtonProps = {}) => {
    const router = useRouter();

    const handleBack = useCallback(() => {
        if (backUrl) {
            // If a specific backUrl is provided, navigate to it
            router.push(backUrl);
        } else {
            // // Check if the previous page is from our site
            // const referrer = document.referrer;
            // const currentOrigin = window.location.origin;
            // const isInternalReferrer = referrer && referrer.startsWith(currentOrigin);
            //
            if (window.history.length > 1) {
                // If there's history and it's from our app
                router.back();
            } else {
                // Navigate to fallbackUrl if no history or external referrer
                router.push(fallbackUrl);
            }
        }
    }, [backUrl, fallbackUrl, router]);

    return { handleBack };
};
