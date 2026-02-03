// CORS
const allowedOrigins = ["https://www.odell.house"];

export function checkCors(request) {
    const requestOrigin = request.headers.get("Origin");
    if (!allowedOrigins.includes(requestOrigin)) {
        return new Response("Forbidden", { status: 403 });
    }
}