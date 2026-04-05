# Exchange Rates App

A currency exchange rate application that displays real-time rates for top global currencies. Built with a focus on user trust, reliability, and smart resource management.

## Problem Statement

The real problem isn't about free users missing out on live data. It's that they're hitting errors when the API crashes or spotting outdated exchange rates—stuff they can easily cross-check on Google. By the time this happens, they've already lost confidence in the product before they've seen enough of what makes it worth paying for.
What we're trying to do here is build back that trust and nudge our conversion rate from 2% up toward 5%, which is where we should be. And we need to do it without burning through more than $5 a day.

## Initial Thought Process

I started by reframing the problem. The core issue isn't that free users don't have real-time data. It's that they lose trust before they see enough value to consider paying.

From a product perspective, my goal is to improve trust signals and move conversion from 2% closer to the 5% benchmark, without blowing the $5/day budget.

First, I'd segment free users by intent. Signals like repeated checks of the same currency pair, enabling alerts, viewing historical charts, or returning within 24 hours suggest higher likelihood to convert. These users matter most.

Second, I'd use the premium API strategically, not continuously. For high-intent users or critical moments like public API failure or data older than 15 minutes, I'd serve cached premium rates. This keeps costs controlled while improving perceived reliability.

On the frontend, I'd fix trust leaks. I'd clearly show "Last updated X minutes ago," label data sources, and replace hard errors with graceful messaging like "Verifying latest rates." This avoids panic and reduces drop-offs.

Finally, I'd turn premium usage into a conversion moment. If a free user sees verified data, I'd explain that real-time updates and history are part of Pro, tied directly to what they're experiencing.

I'd measure success via free-to-paid conversion, trust-related support tickets, bounce rate, and cost per conversion.

## Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express
- Frankfurter API + Open Exchange Rates (dual data sources)

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
