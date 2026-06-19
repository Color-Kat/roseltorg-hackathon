import 'reflect-metadata';
import '@/app/styles/globals.scss';

import type { Metadata, Viewport } from 'next';
import { Inter, Nunito, Onest } from "next/font/google";
import { ReactNode } from "react";
import { twJoin } from "tailwind-merge";

import { Providers } from "@/app/providers";
import { initializeMobx } from "@/shared/lib/mobx";
import { ChatWidget } from "@/widgets/chat";

if (typeof window !== 'undefined') {
    initializeMobx();
}

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin", "cyrillic"] });
const onest = Onest({ variable: "--font-onest", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
    title      : {
        template: '%s | Hackathon Template',
        default : 'Hackathon Template',
    },
    description: 'Starter template: Next.js + React + MobX + React Query + Tailwind + FastAPI.',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru" className={twJoin(inter.variable, nunito.variable, onest.variable)}>
            <body className="antialiased light bg-background text-foreground font-inter">
                <Providers>
                    {children}
                    <ChatWidget />
                </Providers>
            </body>
        </html>
    );
}
