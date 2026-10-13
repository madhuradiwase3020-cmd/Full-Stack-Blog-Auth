require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const port = Number(process.env.PORT) || 5000;

function isApiAlreadyRunning() {
  return new Promise((resolve) => {
    const request = http.get({
      hostname: '127.0.0.1',
      port,
      path: '/api/health',
      timeout: 2000,
    }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        resolve(response.statusCode === 200 && body === '{"status":"ok"}');
      });
    });

    request.on('timeout', () => request.destroy());
    request.on('error', () => resolve(false));
  });
}

const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set(configuredOrigins);

if (process.env.NODE_ENV === 'development') {
  for (const origin of configuredOrigins) {
    const url = new URL(origin);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      url.hostname = url.hostname === 'localhost' ? '127.0.0.1' : 'localhost';
      allowedOrigins.add(url.origin);
    }
  }
}

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('This origin is not allowed by the CORS policy.'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use(notFound);
app.use(errorHandler);

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a secret of at least 32 characters in server/.env.');
  }
  if (await isApiAlreadyRunning()) {
    console.log(`Blog API is already running on http://localhost:${port}; reusing the existing server.`);
    return;
  }
  await connectDB();
  const server = app.listen(port);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  console.log(`Blog API listening on http://localhost:${port}`);
}

if (require.main === module) {
  start().catch((error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Server startup failed: port ${port} is already in use by another application.`);
      process.exitCode = 1;
      return;
    }
    console.error(`Server startup failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = app;