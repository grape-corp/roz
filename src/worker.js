import { handleJoke } from "./routes/joke.js";
import { handleGet } from "./routes/get.js";
import { handleSearch } from "./routes/search.js";
import { handleUpload } from "./routes/upload.js";
import { requireApiKey } from "./components/utils.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        const [action, bucket] = url.pathname.split("/").filter(Boolean);

        // check protected buckets
        const protectedBuckets = ['mp4', 'icon', 'jpg'];
        if (protectedBuckets.includes(bucket)) {
            const authError = requireApiKey(request, env);
            if (authError) return authError;
        }

        // check protected routes
        const protectedRoutes = ['upload'];
        if (protectedRoutes.includes(action)) {
            const authError = requireApiKey(request, env);
            if (authError) return authError;
        }

        switch (action) {
            case "":
                return Response.json({ status: "healthy" });

            case "joke":
                return handleJoke();

            case "get":
                return handleGet(request, env, bucket, url);

            case "search":
                return handleSearch(request, env, bucket, url);

            case "upload":
                return handleUpload(request, env, bucket);

            default:
                return new Response("Not Found", { status: 404 });
        }




    },
};

