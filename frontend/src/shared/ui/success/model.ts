import { ReactNode } from "react";

export type SuccessCardProps = {
    icon?: ReactNode;
    title: string;
    message?: ReactNode;
    buttonText?: string;
    onPress?: () => void;
    href?: string;
};