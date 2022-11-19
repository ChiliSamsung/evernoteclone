import React from "react";
import Note from "../components/Note.jsx";
import CreateNoteArea from "../components/CreateNoteArea.jsx";
import { v4 as uuid } from "uuid";
import Header from "../components/Header.jsx";
import { useNavigate, Navigate } from "react-router-dom";


function Home() {

  const defaultNote = {
    id: uuid(),
    title: "This is my first note",
    content: "Bunch of lorem ipsum"
  }
  const [notes, setNotes] = React.useState([defaultNote]);
  function addNote(note) {
    const newNote = {
      ...note,
      id: uuid()
    }

    setNotes((prevValue) => {
      return [
        ...prevValue,
        newNote
      ]
    });
  }

  //will update to use cookies later
  const loggedIn = false
  if (!loggedIn) {
    return <Navigate to="/login" />
  }
  

  return (
    <div>
      <Header />
      <CreateNoteArea 
        addNote={addNote}

      />
      {notes.map((note) => {
        return <Note 
          key={note.id}
          id={note.id}
          title={note.title} 
          content={note.content} 
          />
      })}
    </div>
  );
}

export default Home;
