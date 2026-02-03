import { resolveBucket, requireApiKey } from "../components/utils";

export async function handleSearch(request, env, bucket, url) {

    const searchTerm = url.searchParams.get("k");
    if (!searchTerm) {
        return new Response(JSON.stringify({ error: "Missing search keyword" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    let targetBucket;
    try {
        targetBucket = resolveBucket(env, bucket);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid bucket" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {

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
}