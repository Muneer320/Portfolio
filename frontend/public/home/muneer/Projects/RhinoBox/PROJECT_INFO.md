# RhinoBox — Intelligent Multi-Modal Storage System

A production-grade, Go-based storage service that accepts any data type through a single unified API and intelligently routes it to the optimal storage backend.

## Tech Stack
Go, PostgreSQL, MongoDB, BadgerDB, Chi Router, Docker, Docker Compose

## Features
- Unified ingestion endpoint for all file types
- Intelligent SQL vs NoSQL routing based on JSON schema analysis
- Async job queue with 10 concurrent workers, crash recovery
- Multi-level caching: L1 LRU (231ns reads) + L2 Bloom + L3 BadgerDB = 3.6M ops/sec
- SHA-256 content deduplication (50%+ storage savings)
- Dual database: PostgreSQL (100K+ inserts/sec) + MongoDB (200K+ inserts/sec)
- 30+ REST endpoints with full-text search
- 107 test files

## Links
- GitHub: [github.com/Muneer320/RhinoBox](https://github.com/Muneer320/RhinoBox)
