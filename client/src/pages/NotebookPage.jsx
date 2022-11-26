import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function NotebookPage() {
  const [cookies] = useCookies(["user"]);
  const [notes, setNotes] = useState([]);
  const { notebookId } = useParams();

  //useEffect with empty array ensures only runs the one time.
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
        <div>
          {notes.map((note) => {
            return (
              <div key={note._id}>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
              </div>
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
      {displayNotes(notes)}
    </div>
  );
}
