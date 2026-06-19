'use client';

import { WhiteButton } from "@/shared/ui/buttons";
import Link, { LinkProps } from "next/link";
import React, { ComponentProps, FC } from 'react';

type WhiteButtonLinkProps = ComponentProps<typeof WhiteButton> & LinkProps;

export const WhiteButtonLink: FC<WhiteButtonLinkProps> = (props) => {

    return (
        <WhiteButton
            as={Link}
            {...props}
        />
    );
}