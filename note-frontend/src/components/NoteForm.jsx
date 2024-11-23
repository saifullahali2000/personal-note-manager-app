import React, { useState } from "react";
import axios from "axios";

function NoteForm({ setNotes }) {
  const [note, setNote] = useState({
    title: "",
    description: "",
    category: "Others",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!note.title || !note.description) {
      setError("Title and Description are required.");
      return;
    }

    axios
      .post("http://localhost:5000/notes", note)
      .then((response) => {
        setNotes((prevNotes) => [...prevNotes, response.data]);
        setNote({ title: "", description: "", category: "Others" });
        setError("");
      })
      .catch((error) => {
        setError("There was an error adding the note.");
      });
  };

  return (
    <div className="mt-4">
      <h2>Add a New Note</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={note.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={note.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select"
            value={note.category}
            onChange={handleChange}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Note
        </button>
      </form>
    </div>
  );
}

export default NoteForm;
