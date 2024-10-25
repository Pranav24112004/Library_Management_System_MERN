// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/libraryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Book Schema and Model
const bookSchema = new mongoose.Schema({
  name: String,
  isbn: String,
  title: String,
  author: String,
  publisher: String
});

const Book = mongoose.model('Book', bookSchema);

// Routes
app.get('/api/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post('/api/books', async (req, res) => {
  const { name, isbn, title, author, publisher } = req.body;
  const book = new Book({ name, isbn, title, author, publisher });
  await book.save();
  res.json({ message: 'Book added successfully' });
});

app.put('/api/books/:isbn', async (req, res) => {
  const { isbn } = req.params;
  const { name, title, author, publisher } = req.body;
  const book = await Book.findOneAndUpdate({ isbn }, { name, title, author, publisher }, { new: true });
  if (book) {
    res.json({ message: 'Book updated successfully' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

app.delete('/api/books/:isbn', async (req, res) => {
  const { isbn } = req.params;
  await Book.findOneAndDelete({ isbn });
  res.json({ message: 'Book deleted successfully' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
