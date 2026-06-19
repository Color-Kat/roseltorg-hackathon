import { ComponentProps, FC } from 'react';
import { twMerge } from "tailwind-merge";

export type DividerWithLabelProps = {
    label: string;
} & ComponentProps<'div'>;

export const DividerWithLabel: FC<DividerWithLabelProps> = ({
    label,
    ...props
}) => {

    return (
        <div
            {...props}
            className={twMerge(
                'flex items-center my-4',
                props.className
            )}
        >
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">{label}</span>
            <div className="flex-1 border-t border-gray-300"></div>
        </div>
    );
}