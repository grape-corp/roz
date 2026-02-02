export async function handleGet(request, env, bucket, url) {
    return new Response(JSON.stringify({ status: "get handler not yet implemented" }), {
        headers: { "Content-Type": "application/json" },
    });
}