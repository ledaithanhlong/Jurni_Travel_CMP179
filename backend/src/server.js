import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import db from './models/index.js';
import apiRouter from './routes/index.js';
import { setupChatSocket } from './socket/chatHandler.js';

const app = express();
const httpServer = createServer(app);

// Dynamic CORS configuration to support both local and tunnel URLs
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_TUNNEL_URL,
].filter(Boolean);

// Allow all tunnelto.dev subdomains for development
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or is a tunnelto.dev subdomain
    if (allowedOrigins.includes(origin) || origin.endsWith('.tunnelto.dev')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.io setup with CORS
const io = new Server(httpServer, {
  cors: corsOptions,
});

// Setup chat socket handlers
setupChatSocket(io);

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

async function start() {
  try {
    await db.sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Database connected');
    httpServer.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`Socket.io ready for connections`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();

