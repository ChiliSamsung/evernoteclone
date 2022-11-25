import React, { useEffect } from "react";
import Note from "../components/Note.jsx";
import CreateNoteArea from "../components/CreateNoteArea.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Home() {
  const [notes, setNotes] = React.useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);

  let loggedIn = cookies.LoggedIn;
  //useEffect with empty array ensures only runs the one time.
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

  console.log(notes);

  return (
    <div>
      <Header />
      <CreateNoteArea addNote={addNote} />
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
  );
}

export default Home;
