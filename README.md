# as.dindon

A lightweight local-network doorbell. One tap on the **🔔** button plays a "ding-dong" sound on every connected device — no accounts, no cloud, no install.

## Use case

User A is at the door and wants to notify User B. Both open the app URL in their browser. User A taps the bell — User B hears it instantly.

## How it works

- A Node.js server serves the frontend and relays events over WebSocket
- The browser generates the doorbell sound via the Web Audio API (no audio files)
- Any device on the same Wi-Fi can ring or receive

## Requirements

- Node.js 16+
- Devices on the same local network / Wi-Fi

## Run

```bash
npm install
npm start
```

The server prints its LAN address on startup:

```
as.dindon running
  Local:   http://localhost:3000
  Network: http://192.168.x.x:3000  ← share this with others on your Wi-Fi
```

Open the Network URL in any browser on the same network. No installation needed on receiver devices.

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Server   | Node.js, Express, ws        |
| Frontend | Plain HTML / Vanilla JS     |
| Audio    | Web Audio API (programmatic)|
