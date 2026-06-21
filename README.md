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
https://your-app.onrender.com/?room=frontdoor
```

Anyone with the URL can ring or receive. Choose a code that's hard to guess.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000` — enter a room code and share the URL with others on your network.

## Deploy to Render.com

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo — Render detects `render.yaml` automatically
4. Click **Deploy**

The service gets a `*.onrender.com` URL with HTTPS and WebSocket (`wss://`) support out of the box.

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Server   | Node.js, Express, ws        |
| Frontend | Plain HTML / Vanilla JS     |
| Audio    | Web Audio API (programmatic)|
| Deploy   | Render.com (`render.yaml`)  |
