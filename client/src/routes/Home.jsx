import React, { useEffect, useCallback } from "react";
import Note from "../components/Note.jsx";
import CreateNoteArea from "../components/CreateNoteArea.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

function Home() {
  const [notes, setNotes] = React.useState([]);
  const [filteredNotes, setFilteredNotes] = React.useState([]);
  const [existingTags, setExistingTags] = React.useState([]);
  let currentFilterTag = "";
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);
  const username = cookies.LoggedInUsername;
  //show notes which have the tag
  const updateFilteredNotes = useCallback(
    (tag) => {
      if (!tag) {
        //if filter is empty, just show all notes
        setFilteredNotes(notes);
      } else {
        const filtered = notes.filter((note) => {
          return note.tags.includes(tag);
        });
        setFilteredNotes(filtered);
      }
    },
    [notes]
  );

  //load up all the notes
  useEffect(() => {
    const queryString = `/notes/${username}`;
    fetch(queryString)
      .then((res) => res.json())
      .then((responseJson) => {
        setNotes(responseJson);
        setFilteredNotes(responseJson);
      });
  }, [username]);

  //load existing tags
  useEffect(() => {
    fetch(`/tags/${username}`)
      .then((res) => res.json())
      .then((responseJson) => {
        setExistingTags(responseJson);
      });
  }, [username]);

  //if notes ever changes, then updated filtered notes
  useEffect(() => {
    updateFilteredNotes(currentFilterTag);
  }, [notes, currentFilterTag, updateFilteredNotes]);

  function addNote(note) {
    const newNote = {
      title: note.title,
      content: note.content,
      tags: note.tags,
    };
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    };
    fetch(`/notes/${username}`, requestOptions).then((res) => {
      if (res.ok) {
        const queryString = `/notes/${username}`;
        fetch(queryString)
          .then((res) => res.json())
          .then((responseJson) => {
            setNotes(responseJson);
          });
      }
    });
  }

  function deleteNote(noteId) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`/notes/${username}/${noteId}`, requestOptions).then((res) => {
      if (res.ok) {
        const queryString = `/notes/${username}`;
        fetch(queryString)
          .then((res) => res.json())
          .then((responseJson) => {
            setNotes(responseJson);
          });
      }
    });
  }

  return (
    <div>
      <Header />
      <CreateNoteArea addNote={addNote} userId={username} />
      <button
        className="open-notebooks btn btn-md btn-primary btn-block"
        onClick={() => {
          navigate("/notebooks");
        }}
      >
        Open Notebooks
        <TextSnippetIcon />
      </button>
      <hr className="rounded" />
      <div className="filter-by-tag-container">
        <label>Filter by Tag:</label>
        <select
          className="form-select notebook-selector"
          onChange={(event) => {
            currentFilterTag = event.target.value;
            updateFilteredNotes(currentFilterTag);
          }}
        >
          <option key={-1}></option>
          {existingTags.map((tag, index) => {
            return <option key={index}>{tag}</option>;
          })}
        </select>
      </div>
      <div className="notes-container mt-3 row">
        {filteredNotes.map((note) => {
          return (
            <Note
              key={note._id}
              id={note._id}
              title={note.title}
              content={note.content}
              deleteNote={deleteNote}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
