import React from "react";
import axios from "axios";

function NoteList({ notes, setNotes }) {
  const deleteNote = (id) => {
    axios
      .delete(`http://localhost:5000/notes/${id}`)
      .then((response) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the note:", error);
      });
  };

  return (
    <div className="mt-4">
      <h2>All Notes</h2>
      <ul className="list-group">
        {notes.map((note) => (
          <li key={note.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>
                <h5>{note.title}</h5>
                <p>{note.description}</p>
                <span className="badge bg-info">{note.category}</span>
              </div>
              <div>
                <button
                  className="btn btn-warning me-2 mr-2"
                  onClick={() => alert("Edit functionality")}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;

