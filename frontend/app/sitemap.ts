import { ROUTES, siteUrl } from "@/shared/consts";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${siteUrl}${ROUTES.HOME}`,
            changeFrequency: "monthly",
            priority: 1.0,
        },
    ];
}
