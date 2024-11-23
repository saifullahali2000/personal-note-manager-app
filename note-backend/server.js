const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  // Import CORS package

const app = express();
const db = new sqlite3.Database('./notes.db');

// Use CORS to allow cross-origin requests
app.use(cors());
app.use(bodyParser.json());

// Create the notes table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'Others',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Validation schema using Joi
const noteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  category: Joi.string().valid('Work', 'Personal', 'Others').default('Others')
});

// API to add a new note
app.post('/notes', (req, res) => {
  const { error, value } = noteSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, description, category } = value;
  const query = `INSERT INTO notes (title, description, category) VALUES (?, ?, ?)`;
  db.run(query, [title, description, category], function (err) {
    if (err) return res.status(500).send("Error adding note.");
    res.status(201).send({ id: this.lastID, ...value });
  });
});

// API to get all notes with optional filtering
app.get('/notes', (req, res) => {
  const { category, title } = req.query;
  let query = `SELECT * FROM notes WHERE 1=1`;
  let params = [];
  
  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }
  
  if (title) {
    query += ` AND title LIKE ?`;
    params.push(`%${title}%`);
  }

  query += ` ORDER BY created_at DESC`;
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send("Error fetching notes.");
    res.status(200).json(rows);
  });
});

// API to update a note
app.put('/notes/:id', (req, res) => {
  const { error, value } = noteSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, description, category } = value;
  const { id } = req.params;
  
  const query = `UPDATE notes SET title = ?, description = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  db.run(query, [title, description, category, id], function (err) {
    if (err) return res.status(500).send("Error updating note.");
    if (this.changes === 0) return res.status(404).send("Note not found.");
    res.status(200).send({ id, ...value });
  });
});

// API to delete a note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM notes WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) return res.status(500).send("Error deleting note.");
    if (this.changes === 0) return res.status(404).send("Note not found.");
    res.status(200).send("Note deleted successfully.");
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
