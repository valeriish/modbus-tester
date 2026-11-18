#!/bin/bash

# Start Tailwind in watch mode in the background
./tailwindcss -i src/app/input.css -o static/styles.css --watch &
TAILWIND_PID=$!

# Start the Rust server
cargo run

# Kill the background Tailwind process when the Rust server stops
kill $TAILWIND_PID