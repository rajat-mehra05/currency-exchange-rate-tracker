# Exchange Rates App

A currency exchange rate application that displays real-time rates for top global currencies. Built with a focus on user trust, reliability, and smart resource management.

## Problem Statement

The real problem isn't about free users missing out on live data. It's that they're hitting errors when the API crashes or spotting outdated exchange rates—stuff they can easily cross-check on Google. By the time this happens, they've already lost confidence in the product before they've seen enough of what makes it worth paying for.
What we're trying to do here is build back that trust and nudge our conversion rate from 2% up toward 5%, which is where we should be. And we need to do it without burning through more than $5 a day.

## Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express
- Frankfurter API (exchange rates data source)

## Installation

### Backend (Local)

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`

### Frontend (Local)

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## Deployment (Vercel)

Connect GitHub repo to Vercel with root directory set to `frontend`. The API routes in `frontend/api/` deploy as serverless functions automatically.

```bash
cd frontend
vercel
```
