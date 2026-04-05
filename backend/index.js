import express from 'express';
import cors from 'cors';
import ratesHandler from './api/rates.js';
import currenciesHandler from './api/currencies.js';
import healthHandler from './api/health.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/rates', ratesHandler);
app.get('/api/currencies', currenciesHandler);
app.get('/api/health', healthHandler);

app.listen(PORT, () => {
  console.log(`Exchange rates API running on http://localhost:${PORT}`);
});
