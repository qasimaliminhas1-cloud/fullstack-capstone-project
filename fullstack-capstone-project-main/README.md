# GiftLink

A full-stack web application connecting people who want to give away
household items with people who prefer to recycle or find free items
instead of buying new ones.

## Stack

| Layer     | Technology                   |
|-----------|------------------------------|
| Frontend  | React                        |
| Backend   | Node.js, Express             |
| Database  | MongoDB (Atlas)              |
| Auth      | JSON Web Tokens (JWT)        |
| Analysis  | natural (sentiment service)  |
| Ops       | Docker, IBM Cloud Code Engine, GitHub Actions |

## Structure

- `giftlink-frontend/` — React client
- `giftlink-backend/` — REST API and MongoDB access
- `sentiment/` — standalone sentiment analysis microservice
- `evidence/` — submission artifacts
