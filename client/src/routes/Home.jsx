import React, { useEffect } from "react";
import Note from "../components/Note.jsx";
import CreateNoteArea from "../components/CreateNoteArea.jsx";
import { v4 as uuid } from "uuid";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Home() {
  const [notes, setNotes] = React.useState([]);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);

  console.log("On home route");
  console.log(cookies);

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
          console.log(responseJson);
          setNotes(responseJson);
        });
    }
  }, []);

  function addNote(note) {
    console.log(note);
    const newNote = {
      title: note.title,
      content: note.content,
    };
    console.log(newNote);
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    };
    fetch(`/notes/${cookies.LoggedInUsername}`, requestOptions).then((res) => {
      console.log(res);
      if (res.ok) {
        const queryString = `/notes/${cookies.LoggedInUsername}`;
        fetch(queryString)
          .then((res) => res.json())
          .then((responseJson) => {
            console.log(responseJson);
            setNotes(responseJson);
          });
      }
    });
  }

  function deleteNote(noteId) {
    console.log(noteId);
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`/notes/${cookies.LoggedInUsername}/${noteId}`, requestOptions).then(
      (res) => {
        console.log(res);
        if (res.ok) {
          const queryString = `/notes/${cookies.LoggedInUsername}`;
          fetch(queryString)
            .then((res) => res.json())
            .then((responseJson) => {
              console.log(responseJson);
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
