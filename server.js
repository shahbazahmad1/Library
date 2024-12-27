// Import required modules
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import indexRouter from './routes/index.js'; // Import the index route
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config(); // Load .env file content into process.env
}

// Initialize Express application
const app = express();

// Configure MongoDB connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, // Use the new URL parser (modern MongoDB connection string support)
    useUnifiedTopology: true, // Enable the new server discovery and monitoring engine
});

// Set up MongoDB connection event listeners
const db = mongoose.connection;
db.on('error', error => console.error('Database connection error:', error)); // Log any connection errors
db.once('open', () => console.log('Connected to MongoDB')); // Confirm successful connection

// Get the directory name of the current module (for ES module compatibility)
const __filename = fileURLToPath(import.meta.url); // Get the current file's absolute path
const __dirname = path.dirname(__filename); // Extract the directory name from the file path

// Set up the EJS view engine and views directory
app.set('view engine', 'ejs'); // Specify EJS as the template engine
app.set('views', path.join(__dirname, 'views')); // Define the views directory path
app.set('layout', 'layouts/layout'); // Specify the layout template for EJS

// Middleware configuration
app.use(expressLayouts); // Enable Express layouts for consistent layouts across pages
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

// Set up routes
app.use('/', indexRouter); // Mount the index route at the root URL

// Start the server
const PORT = process.env.PORT || 3000; // Use the environment-defined port or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log a message when the server starts
});
