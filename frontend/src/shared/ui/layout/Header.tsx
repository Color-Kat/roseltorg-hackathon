import { ROUTES } from "@/shared/consts";
import { Logo } from "@/shared/ui/Logo";
import Link from "next/link";
import React, { FC } from 'react';
import { twJoin } from "tailwind-merge";

export const Header: FC = () => {

    return (
        <header className={twJoin(
            "fixed top-3 left-3 right-3 h-18 container-mobile",
            "bg-white shadow-medium rounded-3xl",
            "flex items-center",
            "px-2"
        )}>
            <Link href={ROUTES.HOME} className="flex items-center">
                <Logo className="size-16"/>

                <div className="ml-2 text-3xl font-extrabold font-nunito text-primary-green">App</div>
            </Link>
        </header>
    );
}