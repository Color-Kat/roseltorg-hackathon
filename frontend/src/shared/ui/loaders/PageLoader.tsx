import { AcrobaticLoader } from "@/shared/ui/loaders/AcrobaticLoader";
import { FC, memo } from 'react';

export const PageLoader: FC = memo(() => {

    return (
        <div
            className="fixed z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/50 rounded-2xl backdrop-blur-xs size-42 shadow-large flex-center"
        >
            {/*<Spinner*/}
            {/*    classNames={{*/}
            {/*        // circle1: "border-4",*/}
            {/*        // circle2: "border-4",*/}
            {/*        label: "text-lg font-semibold text-title-black mt-2",*/}
            {/*    }}*/}
            {/*    size="lg"*/}
            {/*    color="default"*/}
            {/*    label="Загрузка..."*/}
            {/*    variant="gradient"*/}
            {/*/>*/}

            <AcrobaticLoader />

            <p className="absolute bottom-4 flex font-semibold text-title-black mt-2">
                Загрузка...
            </p>
        </div>
    );
});