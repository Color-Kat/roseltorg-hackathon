'use client';

import { Card, type CardProps } from '@heroui/react';
import { squircle } from 'corner-smoothing';
import { useMemo } from 'react';
import { twJoin } from "tailwind-merge";

type SquircleCardProps = CardProps & {
    cornerRadius?: number;
    cornerSmoothing?: number;
};

/**
 * Card with squircle form.
 * Under the hood used `clip-path`.
 * Please, use wrapper-component with drop-shadow if you want to add a shadow.
 */
export function SquircleCard({
    cornerRadius = 24,
    cornerSmoothing = 0.6,
    ...props
}: SquircleCardProps) {
    // Use squircle HOC to properly wrap Card component.
    // If use <Squircle> component, there's pixels at the corners
    const SquircleWrappedCard = useMemo(
        () =>
            squircle(Card, {
                cornerRadius,
                cornerSmoothing,
            }),
        [cornerRadius, cornerSmoothing]
    );

    return <SquircleWrappedCard {...props} className={twJoin(
        'rounded-3xl shadow-none',
        props.className,
    )} />;
}
