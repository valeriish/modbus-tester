# Modbus TCP Web Gateway

A lightweight HTTP/1.1 server built from scratch in Rust (`std::net`) with a REST API for polling industrial devices via **Modbus TCP** (`tokio-modbus`).

## Quick Start

**Standard run** (uses pre-compiled `static/styles.css` and falls back to CDN for Vue 3 if not present locally):
```bash
cargo run
```

**Offline mode setup** (downloads local `vue.esm-browser.prod.js` into `static/` via `curl`):
```bash
cargo run --features fetch-vue
```

**Run with Tailwind CSS rebuild**:
```bash
cargo run --features build-css
```

*Features can be combined for full offline deployment: `cargo build --release --features "build-css fetch-vue"`.*

Server runs at **`http://127.0.0.1:9000`**.

## API

### `POST /api/modbus`
Requires header `Content-Type: application/json`.

Address prefixes determine the Modbus register type (`0` — Coil, `1` — Discrete Input, `3` — Input Register, `4` — Holding Register), followed by a 1-based address:

**Request:**
```json
{
  "address": "192.168.1.50",
  "port": 502,
  "registers": ["35", "4100", "012"]
}
```

**Response (`200 OK`):**
```json
{
  "status": "success",
  "device": "192.168.1.50:502",
  "data": [
    ["35", 1024],
    ["4100", 255],
    ["012", 1]
  ]
}
```

*Returns raw `u16` values with a 3-second network timeout. Errors return `400`, `404`, or `415`.*

## Roadmap

- [x] HTTP/1.1 server, static/SPA routing & Modbus TCP API
- [ ] Multi-threaded `ThreadPool` for concurrent requests