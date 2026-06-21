(function () {
  const room = new URLSearchParams(location.search).get('room') || '';

  if (!room) {
    showLobby();
  } else {
    startBell(room);
  }

  // -- Lobby --

  function showLobby() {
    const container = document.querySelector('.container');
    while (container.firstChild) container.removeChild(container.firstChild);

    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = 'Dindon';

    const lobby = document.createElement('div');
    lobby.className = 'lobby';

    const input = document.createElement('input');
    input.id = 'room-input';
    input.className = 'room-input';
    input.placeholder = 'Room code';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.maxLength = 64;

    const btn = document.createElement('button');
    btn.id = 'join-btn';
    btn.className = 'join-btn';
    btn.textContent = 'Join';

    lobby.appendChild(input);
    lobby.appendChild(btn);
    container.appendChild(title);
    container.appendChild(lobby);

    function join() {
      const code = input.value.trim();
      if (code) location.href = '/?room=' + encodeURIComponent(code);
    }

    btn.addEventListener('click', join);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') join(); });
    input.focus();
  }

  // -- Bell --

  function startBell(room) {
    const bellBtn  = document.getElementById('bell');
    const statusEl = document.getElementById('status');

    let audioCtx = null;
    let ws = null;
    let reconnectTimer = null;

    // -- Audio --

    function getAudioCtx() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function playTone(freq, startTime, duration) {
      const ctx = getAudioCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, startTime + duration);

      gain.gain.setValueAtTime(0.6, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    function playDoorbell() {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      playTone(523, now, 0.6);
      playTone(392, now + 0.45, 0.8);
    }

    // -- WebSocket --

    function connect() {
      const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
      ws = new WebSocket(`${protocol}://${location.host}/?room=${encodeURIComponent(room)}`);

      ws.onopen = () => {
        setStatus('Connected · ' + room, 'ok');
        clearTimeout(reconnectTimer);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ring') {
            playDoorbell();
            flashBell();
          }
        } catch {}
      };

      ws.onclose = () => {
        setStatus('Reconnecting…', 'warn');
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = () => ws.close();
    }

    // -- UI --

    function setStatus(text, state) {
      statusEl.textContent = text;
      statusEl.className = 'status ' + (state || '');
    }

    function flashBell() {
      bellBtn.classList.add('ring');
      setTimeout(() => bellBtn.classList.remove('ring'), 600);
    }

    bellBtn.addEventListener('click', () => {
      getAudioCtx();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ring' }));
      }
    });

    connect();
  }
})();
