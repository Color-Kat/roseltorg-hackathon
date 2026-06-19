declare module "*.png";
declare module "*.jpg";
declare module "*.gif";
declare module "*.mp3";
declare module "*.mp4";

// SVGR
declare module '*.svg' {
    import { FC, SVGProps } from 'react'
    const content: FC<SVGProps<SVGElement>>
    export default content
}

declare module '*.svg?url' {
    const content: any
    export default content
}

