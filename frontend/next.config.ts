import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    reactCompiler: true,
    devIndicators: {
        position: 'top-right',
    },
    experimental: {
        optimizePackageImports: ['react-icons'],
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as     : '*.js',
            },
        },
    },
};

export default nextConfig;
