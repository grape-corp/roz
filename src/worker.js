export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // CORS
        const allowedOrigins = ["https://grape-corp.hyperworld.host"];
        const requestOrigin = request.headers.get("Origin");


        // default route
        if (url.pathname === "/") {
            return new Response(JSON.stringify({ status: "healthy" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        if (url.pathname === "/joke") {
            return handleJoke();
        }

        if (!allowedOrigins.includes(requestOrigin)) {
            return new Response("Forbidden", { status: 403 });
        }

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

function handleJoke() {
    const jokes = [
        "I'm watching you, Wazowski… always watching… except on my lunch break, then I’m *barely* watching.",
        "Why don’t I ever tell jokes at work? Because laughter is a distraction, Wazowski, and distractions mean paperwork.",
        "Knock, knock. Who's there? Wazowski. Wazowski who? Exactly my point. WHERE’S YOUR PAPERWORK?!",
        "Monsters these days don’t appreciate hard work. Back in my day, we scared kids uphill, both ways, in the snow!",
        "Why did the monster bring a pencil to the scare floor? Because he knew Roz would make him rewrite his paperwork… again.",
        "Wazowski, I dreamt I was on vacation… but then I woke up and realized my only trip is from my desk to the shredder.",
        "Why did the monster cross the road? To get away from his missing paperwork… but I *found* him.",
        "What’s a monster’s worst nightmare? A world without screams? No. A world where Roz does surprise paperwork inspections… every hour.",
        "Wazowski, I told you a joke once, but you didn’t file it in triplicate, so I had to confiscate it.",
        "They say laughter is the best medicine. But you know what *really* keeps me going? Paperwork. Endless, wonderful paperwork."
      ];
      
  
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  
    return new Response(JSON.stringify({ joke: randomJoke }), {
      headers: { "Content-Type": "application/json" },
    });
  }