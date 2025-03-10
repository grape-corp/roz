export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        /* CORS
        const allowedOrigins = ["https://irving.grape.wtf", "https://grape-corp.hyperworld.host"];
        const requestOrigin = request.headers.get("Origin");
        if (!allowedOrigins.includes(requestOrigin)) {
            return new Response("Forbidden", { status: 403 });
        }
        */

        // default route
        if (url.pathname === "/") {
            return new Response(JSON.stringify({ status: "healthy" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Parse path segments
        const pathSegments = url.pathname.split('/').filter(Boolean);
        if (pathSegments[0] !== 'search') {
            return new Response("Not Found", { status: 404 });
        }

        const bucket = pathSegments[1];
        const searchTerm = url.searchParams.get("k");

        if (!searchTerm) {
            return new Response(JSON.stringify({ error: "Missing search keyword" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            let targetBucket;
            switch (bucket) {
                case 'image':
                    targetBucket = env.IMAGE_BUCKET;
                    break;
                case 'video':
                    targetBucket = env.VIDEO_BUCKET;
                    break;
                case 'mp4':
                    targetBucket = env.MP4_BUCKET;
                    break;
                default:
                    return new Response(JSON.stringify({ error: "Invalid bucket" }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
            }

            const results = [];
            let cursor;

            do {
                const listOptions = cursor ? { cursor } : {};
                const response = await targetBucket.list(listOptions);
                const matches = response.objects.filter(obj => obj.key.includes(searchTerm));
                results.push(...matches.map(obj => obj.key));
                cursor = response.truncated ? response.cursor : null;
            } while (cursor);


            if (results.length === 0) {
                return new Response(JSON.stringify({ error: "No results found in bucket: " + bucket }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }
            return new Response(JSON.stringify({ results }), {
                headers: { "Content-Type": "application/json" },
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    },
};
