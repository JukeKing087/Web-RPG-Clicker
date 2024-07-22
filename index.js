const express = require('express');
const path = require('path');
const dataRouter = require('./routes/dataRoutes');
const authRouter = require('./routes/authRoutes'); // Import the new router

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

// Use authRouter for routes related to authentication
app.use('/', authRouter);
app.use('/database', dataRouter);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).render('404', { error: 'Page Not Found' });
});

// Handle other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { error: 'Something went wrong!' });
});

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app; // Export the app for testing
