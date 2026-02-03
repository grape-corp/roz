import { resolveBucket, requireApiKey } from "../components/utils.js";

const BUCKET_EXTENSIONS = {
    "jpg": ".jpg",
    "jpg-public": ".jpg",
    "mp4": ".mp4",
    "icon": ".png",
};

export async function handleGet(request, env, bucket, url) {
    if (!bucket) {
        return new Response("Missing bucket", { status: 400 });
    }

    const keyBase = url.searchParams.get("k");
    if (!keyBase) {
        return new Response("Missing key", { status: 400 });
    }

    // Resolve bucket
    let targetBucket;
    try {
        targetBucket = resolveBucket(env, bucket);
    } catch (err) {
        return err; // resolveBucket already throws Response
    }

    // Infer extension
    const ext = BUCKET_EXTENSIONS[bucket];
    if (!ext) {
        return new Response("Unknown bucket type", { status: 400 });
    }

    const key = keyBase.includes(".") ? keyBase : keyBase + ext;

    // Fetch object
    const object = await targetBucket.get(key);
    if (!object) {
        return new Response("File not found", { status: 404 });
    }

    // Set content type automatically (R2) or infer manually
    const headers = new Headers();
    if (object.contentType) {
        headers.set("Content-Type", object.contentType);
    } else {
        if (ext === ".jpg" || ext === ".jpeg") headers.set("Content-Type", "image/jpeg");
        if (ext === ".png") headers.set("Content-Type", "image/png");
        if (ext === ".mp4") headers.set("Content-Type", "video/mp4");
    }

    // Allow browser caching
    headers.set("Cache-Control", "public, max-age=60");

    return new Response(object.body, { headers });
}
