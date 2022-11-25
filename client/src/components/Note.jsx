import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function Note(props) {
  const navigate = useNavigate();
  return (
    <div
      className="note"
      onClick={() => {
        navigate(`/notes/${props.id}`);
      }}
    >
      <h2>{props.title}</h2>
      <p>{props.content}</p>
      <button
        onClick={() => {
          props.deleteNote(props.id);
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
