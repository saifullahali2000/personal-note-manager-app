import React from "react";

function SearchBar({ setSearch }) {
  const handleSearchChange = (e) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="mb-4">
      <h3>Search & Filter Notes</h3>
      <div className="row">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="Search by title"
            onChange={handleSearchChange}
          />
        </div>
        
      </div>
    </div>
  );
}

export default SearchBar;


