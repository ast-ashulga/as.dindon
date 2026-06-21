# as.dindon

A doorbell for the internet. One tap on the **🔔** button plays a "ding-dong" sound on every connected device in the same room — no accounts, no install.

## Use case

User A is at the door and wants to notify User B. Both open the same room URL in their browser. User A taps the bell — User B hears it instantly, anywhere in the world.

## How it works

- A Node.js server serves the frontend and relays events over WebSocket
- Clients are grouped by **room code** — only devices in the same room hear the ring
- The browser generates the doorbell sound via the Web Audio API (no audio files)
- Room codes live in the URL (`?room=<code>`), so sharing is just sharing a link

## Room codes

Open the app and enter any room code (e.g. `frontdoor`, `office`, `myhome`).  
Share the resulting URL with anyone who should hear the bell:

```
https://your-project.glitch.me/?room=frontdoor
```

Anyone with the URL can ring or receive. Choose a code that's hard to guess.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000` — enter a room code and share the URL with others.

## Deploy to Glitch (free, no credit card)

Glitch hosts Node.js apps for free with WebSocket support and a permanent URL.

1. Go to [glitch.com](https://glitch.com) and sign in (GitHub login works)
2. Click **New Project** → **Import from GitHub**
3. Paste your repo URL and click **OK**
4. Glitch installs dependencies and starts the server automatically
5. Click **Share** (top right) → copy the live URL (e.g. `https://as-dindon.glitch.me`)

Open the URL → enter a room code → share `https://as-dindon.glitch.me/?room=<your-code>`.

**Note:** Free Glitch projects sleep after ~5 minutes of inactivity. The first request after sleep takes ~20 seconds to wake up — the WebSocket client reconnects automatically. A free [UptimeRobot](https://uptimerobot.com) ping every 4 minutes keeps it awake if needed.

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Server   | Node.js, Express, ws        |
| Frontend | Plain HTML / Vanilla JS     |
| Audio    | Web Audio API (programmatic)|
| Deploy   | Glitch.com (free)           |
