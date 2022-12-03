import React, { useEffect } from "react";
import Note from "../components/Note.jsx";
import CreateNoteArea from "../components/CreateNoteArea.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

function Home() {
  const [notes, setNotes] = React.useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);
  const loggedIn = cookies.LoggedIn;

  //load up the notes
  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      const queryString = `/notes/${cookies.LoggedInUsername}`;
      fetch(queryString)
        .then((res) => res.json())
        .then((responseJson) => {
          setNotes(responseJson);
        });
    }
  }, [cookies, loggedIn, navigate]);

  function addNote(note) {
    const newNote = { title: note.title, content: note.content };
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    };
    fetch(`/notes/${cookies.LoggedInUsername}`, requestOptions).then((res) => {
      if (res.ok) {
        const queryString = `/notes/${cookies.LoggedInUsername}`;
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
    fetch(`/notes/${cookies.LoggedInUsername}/${noteId}`, requestOptions).then(
      (res) => {
        if (res.ok) {
          const queryString = `/notes/${cookies.LoggedInUsername}`;
          fetch(queryString)
            .then((res) => res.json())
            .then((responseJson) => {
              setNotes(responseJson);
            });
        }
      }
    );
  }

  return (
    <div>
      <Header />
      <CreateNoteArea addNote={addNote} />
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
      <div className="notes-container">
        {notes.map((note) => {
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
