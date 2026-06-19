import { CircleBackButton } from "@/shared/ui/back-button";
import { Fullscreen } from "@/shared/ui/fullscreen/Fullscreen";
import { FC, PropsWithChildren } from 'react';

type FullscreenWithTitleProps = PropsWithChildren<{
    title: string;
}>;

export const FullscreenWithTitle: FC<FullscreenWithTitleProps> = ({
    title,
    children
}) => {

    return (
        <Fullscreen>
            <div className="size-full flex flex-col items-center bg-layout overflow-y-auto">

                {/* Page title */}
                <section className="relative w-full p-5">
                    <CircleBackButton className=""/>

                    <h1 className="absolute top-1/2 left-1/2 -translate-1/2 lg:text-xl text-lg font-semibold font-onest text-center w-full pointer-events-none">
                        {title}
                    </h1>
                </section>

                {children}
            </div>
        </Fullscreen>
    );
}