import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/users';
import squadRoutes from './routes/squads';
import paymentRoutes from './routes/payments';
import streamRoutes from './routes/streams';
import notificationRoutes from './routes/notifications';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'rally-api',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/squads', squadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Rally API running on port ${PORT}`);
});

export default app;
