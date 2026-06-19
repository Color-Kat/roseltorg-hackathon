'use client';

import { GreenButton } from "@/shared/ui/buttons";
import Link, { LinkProps } from "next/link";
import React, { ComponentProps, FC } from 'react';

type GreenLinkButtonProps = ComponentProps<typeof GreenButton> & LinkProps;

export const GreenButtonLink: FC<GreenLinkButtonProps> = (props) => {

    return (
        <GreenButton
            as={Link}
            {...props}
        />
    );
}