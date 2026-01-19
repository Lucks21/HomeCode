import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
// TODO: Import and use routes here
// import routes from './routes';
// app.use('/api', routes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'AccountCode API is running' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
