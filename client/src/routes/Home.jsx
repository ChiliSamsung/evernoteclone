import React, { useEffect } from "react";
import Note from "../components/Note.jsx";
import CreateNoteArea from "../components/CreateNoteArea.jsx";
import { v4 as uuid } from "uuid";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Home() {
  const defaultNote = {
    id: uuid(),
    title: "This is my first note",
    content: "Bunch of lorem ipsum",
  };
  const [notes, setNotes] = React.useState([defaultNote]);
  function addNote(note) {
    const newNote = {
      ...note,
      id: uuid(),
    };

    setNotes((prevValue) => {
      return [...prevValue, newNote];
    });
  }
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

  return (
    <div>
      <Header />
      <CreateNoteArea addNote={addNote} />
      {notes.map((note) => {
        return (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
          />
        );
      })}
    </div>
  );
}

export default Home;
