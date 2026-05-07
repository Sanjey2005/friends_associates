import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://friendsassociates.org';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/login/',
                    '/api/',
                    '/forgot-password',
                    '/reset-password',
                    '/verify-email',
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
