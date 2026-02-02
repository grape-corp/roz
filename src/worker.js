import { handleJoke } from "./routes/joke.js";
import { requireApiKey } from "./components/utils.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // CORS
        const allowedOrigins = ["https://grape-corp.hyperworld.host"];
        const requestOrigin = request.headers.get("Origin");
        /*
        if (!allowedOrigins.includes(requestOrigin)) {
            return new Response("Forbidden", { status: 403 });
        }
        */

        const [action, bucket] = url.pathname.split("/").filter(Boolean);

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
                requireApiKey(request, env);
                return handleUpload(request, env, bucket);

            default:
                return new Response("Not Found", { status: 404 });
        }




    },
};

