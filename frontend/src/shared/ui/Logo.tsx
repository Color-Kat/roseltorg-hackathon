import Image from "next/image";
import { ComponentProps, FC } from 'react';

export const Logo: FC<Partial<ComponentProps<typeof Image>>> = (
    props
) => {

    return (
        <Image
            {...props}
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            priority
        />
    );
}