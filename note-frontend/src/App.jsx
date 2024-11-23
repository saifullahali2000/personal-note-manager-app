import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteList from "./components/NoteList";
import NoteForm from "./components/NoteForm";
import SearchBar from "./components/SearchBar";

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [search, setSearch] = useState({ title: "", category: "" });

  useEffect(() => {
    // Fetch notes from the backend API
    axios.get("http://localhost:5000/notes")
      .then((response) => {
        setNotes(response.data);
        setFilteredNotes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the notes:", error);
      });
  }, []);

  // Function to filter notes based on search criteria
  useEffect(() => {
    let filtered = notes;
    if (search.title) {
      filtered = filtered.filter((note) =>
        note.title.toLowerCase().includes(search.title.toLowerCase())
      );
    }
    if (search.category) {
      filtered = filtered.filter((note) =>
        note.category === search.category
      );
    }
    setFilteredNotes(filtered);
  }, [search, notes]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Notes Application</h1>

      <SearchBar setSearch={setSearch} />
      <NoteForm setNotes={setNotes} />
      <NoteList notes={filteredNotes} setNotes={setNotes} />
    </div>
  );
}

export default App;

