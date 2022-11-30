import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Note from "../components/Note.jsx";

export default function NotebookPage() {
  const [cookies] = useCookies(["user"]);
  const [notes, setNotes] = useState([]);
  const { notebookId } = useParams();

  //load notes for this notebook
  useEffect(() => {
    const queryString = `/${cookies.LoggedInUsername}/${notebookId}`;
    fetch(queryString)
      .then((res) => res.json())
      .then((responseJson) => {
        setNotes(responseJson);
      });
  }, [cookies, notebookId]);

  function displayNotes(notes) {
    if (notes.length > 0) {
      return (
        <div className="notes-container">
          {notes.map((note) => {
            return (
              <Note
                key={note._id}
                id={note._id}
                title={note.title}
                content={note.content}
              />
            );
          })}
        </div>
      );
    } else {
      return <p>No notes in this notebook yet</p>;
    }
  }

  return (
    <div>
      <Header />
      <h2>Notebook ID: {notebookId}</h2>
      {displayNotes(notes)}
    </div>
  );
}
