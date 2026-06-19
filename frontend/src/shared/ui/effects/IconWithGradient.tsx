import React, { useId } from "react";
import type { IconBaseProps, IconType } from "react-icons";

interface IconWithGradientProps extends IconBaseProps {
    Icon: IconType;
    from: string;
    via?: string;
    to: string;
    direction?: number;
}

/**
 * Calculates the coordinates for a linear gradient based on the given angle.
 *
 * @param angle - The angle in degrees.
 * @return An object with the x1, y1, x2, y2 coordinates for the gradient.
 */
const getGradientDirection = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const x = Math.cos(rad);
    const y = Math.sin(rad);
    const normalizer = Math.max(Math.abs(x), Math.abs(y));

    return {
        x1: `${50 - (x / normalizer) * 50}%`,
        y1: `${50 - (y / normalizer) * 50}%`,
        x2: `${50 + (x / normalizer) * 50}%`,
        y2: `${50 + (y / normalizer) * 50}%`,
    };
};

/**
 * Add gradient for any Svg icon (especially from react-icons)
 * because they don't support gradient natively.
 */
export default function IconWithGradient({
    Icon,
    from,
    to,
    via,
    direction = 90,
    ...props
}: IconWithGradientProps) {

    const gradId = useId();
    const gradientDirectionCoords = getGradientDirection(direction);

    return (
        <>
            {/* Create svg with gradient to apply it for Icon */}
            <svg width="0" height="0">
                <defs>
                    <linearGradient id={gradId} {...gradientDirectionCoords}>
                        <stop offset="0%" stopColor={from} />
                        {via && <stop offset="50%" stopColor={via} />}
                        <stop offset="100%" stopColor={to} />
                    </linearGradient>
                </defs>
            </svg>

            <Icon fill={`url(#${gradId})`} {...props} />
        </>
    );
}

