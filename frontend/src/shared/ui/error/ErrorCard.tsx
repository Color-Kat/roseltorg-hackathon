import { GreenButton } from '@/shared/ui/buttons';
import { ErrorCardProps } from "@/shared/ui/error/model";
import { GreenButtonLink } from "@/shared/ui/links";
import { Card, CardBody } from "@heroui/card";
import Image from "next/image";
import React, { FC } from 'react';

import warningIcon from './warning.png';

export const ErrorCard: FC<ErrorCardProps> = ({
    icon,
    title,
    message,
    buttonText,
    onPress,
    href
}) => {
    return (
        <Card className="w-full py-2 px-2 max-w-xs rounded-3xl">
            <CardBody className="flex items-center px-2 text-base/[1.3]">
                {icon
                    ? icon
                    : <Image
                        src={warningIcon}
                        alt="Error Icon"
                        width={50}
                        height={50}
                    />
                }

                <h4 className="text-primary-coral text-center font-extrabold mt-4">
                    {title}
                </h4>

                {message &&
                    <p className="text-[#27272A] mt-1.5 text-center leading-snug text-pretty">
                        {message}
                    </p>
                }
            </CardBody>

            {/* Display button or link */}
            {/* Button */}
            {buttonText && !href &&
                <GreenButton
                    className="mt-2 rounded-2xl"
                    onPress={onPress}
                    size="lg"
                >
                    {buttonText}
                </GreenButton>
            }

            {/* Link */}
            {buttonText && href &&
                <GreenButtonLink
                    className="mt-2 rounded-2xl"
                    onPress={onPress}
                    href={href}
                    size="lg"
                >
                    {buttonText}
                </GreenButtonLink>
            }
        </Card>
    );
}