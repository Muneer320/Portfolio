# CPStats API — Competitive Programming Ratings API

A lightweight, production-ready REST API that aggregates competitive programming ratings from LeetCode, Codeforces, CodeChef, and AtCoder into a single, consistent interface.

## Tech Stack
Python, FastAPI, Docker, uvicorn, Pydantic

## Features
- Single & batch queries (up to 20 in one request)
- LRU cache with 1000-entry capacity and 4-hour TTL
- API key authentication with Bearer token
- Rate limiting: 100 requests/hour per client
- Health checks, CORS configuration
- Docker support for Hugging Face Spaces deployment

## Links
- Live: [muneer320-cpstats-api.hf.space](https://muneer320-cpstats-api.hf.space)
- GitHub: [github.com/Muneer320/CPStats-API](https://github.com/Muneer320/CPStats-API)
