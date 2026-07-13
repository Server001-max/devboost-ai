const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');
const winston = require('winston');

dotenv.config();

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;

// Security
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const codeRoutes = require('./routes/code');
const docsRoutes = require('./routes/docs');
const testRoutes = require('./routes/test');
const securityRoutes = require('./routes/security');
const translateRoutes = require('./routes/translate');

app.use('/api/code', codeRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/test', testRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/translate', translateRoutes);

// Main pages
app.get('/', (req, res) => {
  res.render('index', {
    title: 'DevBoost AI - AI-Powered Developer Toolkit',
    version: '3.0.0'
  });
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - DevBoost AI'
  });
});

app.get('/playground', (req, res) => {
  res.render('playground', {
    title: 'Playground - DevBoost AI'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
    version: '3.0.0'
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 DevBoost AI v3.0.0                 ║
  ║   📡 Running on http://localhost:${PORT}   ║
  ║   ⭐ AI-Powered Developer Toolkit        ║
  ║   🔥 Star us on GitHub!                 ║
  ╚══════════════════════════════════════════╝
  `);
});
