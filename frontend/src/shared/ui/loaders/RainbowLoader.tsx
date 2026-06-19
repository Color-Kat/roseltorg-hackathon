import React, { FC, memo } from 'react';
import {twJoin} from "tailwind-merge";
import './rainbow-loader.scss';

/**
 * Google like loader
 */
export const RainbowLoader: FC = memo(() => {
    // You can add width to props
    return (
        <div className={twJoin("rainbow-loader")}>
            <svg className="circular" viewBox="25 25 50 50">
                <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
            </svg>
        </div>
    );
});