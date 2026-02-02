export function handleJoke() {
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