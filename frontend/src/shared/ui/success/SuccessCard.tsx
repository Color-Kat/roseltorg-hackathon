import { GreenButtonLink } from "@/shared/ui/links";
import { SuccessCardProps } from "@/shared/ui/success/model";
import { Card, CardBody } from "@heroui/card";
import Image from "next/image";
import React, { FC } from 'react';
import { GreenButton } from "../buttons";

import successIcon from './success.png';

export const SuccessCard: FC<SuccessCardProps> = ({
    icon,
    title,
    message,
    buttonText,
    onPress,
    href
}) => {
    return (
        <Card className="mx-4 w-full py-2 px-2 max-w-xs rounded-3xl m-0">
            <CardBody className="flex items-center px-2 text-base/[1.3]">
                {icon ?? <Image
                    src={successIcon}
                    alt="Success Icon"
                    width={100}
                    height={100}
                />}

                <h4 className="text-primary-green text-center font-extrabold text-lg/[1.3] mt-4">
                    {title}
                </h4>

                {/* Body */}
                {message &&
                    <p className="text-[#27272A] mt-1.5 text-center leading-snug">
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