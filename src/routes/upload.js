export async function handleUpload(request, env, bucket) {
    return new Response(JSON.stringify({ status: "upload handler not yet implemented" }), {
        headers: { "Content-Type": "application/json" },
    });
}