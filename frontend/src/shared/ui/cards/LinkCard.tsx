'use client';

import { Card, type CardProps } from '@heroui/react';
import Link, { type LinkProps as NextLinkProps } from "next/link";

type LinkCardProps = CardProps & NextLinkProps;

export const LinkCard = ({ ref, ...props }: LinkCardProps) => {
    return (
        <Card
            ref={ref}
            as={Link}
            {...props}
        />
    );
};