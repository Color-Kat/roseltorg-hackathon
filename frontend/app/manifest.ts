import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name            : 'Hackathon Template',
        short_name      : 'Template',
        description     : 'Next.js + FastAPI hackathon starter template.',
        start_url       : '/',
        display         : 'standalone',
        background_color: '#ffffff',
        theme_color     : '#69a93f',
        icons           : [
            { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
    }
}
