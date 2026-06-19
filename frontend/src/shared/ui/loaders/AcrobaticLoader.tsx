import React, { FC, memo } from 'react';
import {twJoin} from "tailwind-merge";
import './acrobatic-loader.scss';

export const AcrobaticLoader: FC = memo(() => {
    return (
        <svg
            className={twJoin("acrobatic-loader")}
            viewBox="0 0 128 256"
            width="128px"
            height="256px"
            xmlns="http://www.w3.org/2000/svg"
            style={{ willChange: 'auto' }}
        >
            <defs>
                <linearGradient id="acrobatic-loader-grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(87, 50%, 52%)"/>
                    <stop offset="100%" stopColor="hsl(86,38%,47%)"/>
                </linearGradient>
                <linearGradient id="acrobatic-loader-grad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(36, 100%, 50%)"/>
                    <stop offset="50%" stopColor="hsl(86,38%,47%)"/>
                    <stop offset="100%" stopColor="hsl(86,38%,47%)"/>
                </linearGradient>
            </defs>
            <circle className="acrobatic-loader__ring" r="56" cx="64" cy="192" fill="none" stroke="#ddd" strokeWidth="16"
                    strokeLinecap="round"/>
            <circle className="acrobatic-loader__worm1" r="56" cx="64" cy="192" fill="none" stroke="url(#acrobatic-loader-grad1)" strokeWidth="16"
                    strokeLinecap="round" strokeDasharray="87.96 263.89"/>
            <path className="acrobatic-loader__worm2" d="M120,192A56,56,0,0,1,8,192C8,161.07,16,8,64,8S120,161.07,120,192Z"
                  fill="none" stroke="url(#acrobatic-loader-grad2)" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray="87.96 494"/>
        </svg>
    );
});

AcrobaticLoader.displayName = 'AcrobaticLoader';