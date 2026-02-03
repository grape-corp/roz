 export function resolveBucket(env, bucket) {
    switch (bucket) {
        case 'jpg':
            return env.JPG;
        case 'jpg-public':
            return env.JPG_PUBLIC;
        case 'mp4':
            return env.MP4;
        case 'icon':
            return env.ICON
        default:
            throw new Response("Invalid bucket", { status: 400 });
    }
 }
 
 export function requireApiKey(request, env) {
    const requestApiKey = request.headers.get("Authorization");
    const apiKeys = env.API_KEYS.split(",");
    if (!requestApiKey || !apiKeys.includes(requestApiKey)) {
        return new Response("Unauthorized", { status: 401 });
    }
    // Return null if authorized
    return null;
}
