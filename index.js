// index.js
const express = require('express');
const path = require('path');
const usersRouter = require('./routes/users')

const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
