import { ReactNode } from "react";

export type ErrorCardProps = {
    icon?: ReactNode;
    title: ReactNode;
    message?: ReactNode;
    buttonText?: string;
    onPress?: () => void;
    href?: string;
};