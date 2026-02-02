 export function resolveBucket(env, bucket) {
    switch (bucket) {
        case 'image':
            return env.IMAGE_BUCKET;
        case 'image-public':
            return env.IMAGE_PUBLIC_BUCKET;
        case 'mp4':
            return env.MP4_BUCKET;
        case 'icon':
            return env.HYP_BUCKET;
        default:
            throw new Response("Invalid bucket", { status: 400 });
    }
 }
 
 export function requireApiKey(request, env) {
    const requestApiKey = request.headers.get("Authorization");
    const apiKeys = env.API_KEYS.split(",");
    if (!requestApiKey || !apiKeys.includes(requestApiKey)) {
        throw new Response("Unauthorized", { status: 401 });
    }
 }