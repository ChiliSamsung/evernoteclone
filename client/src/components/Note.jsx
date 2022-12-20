import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function Note(props) {
  const navigate = useNavigate();
  return (
    <div
      className="note col-4"
      onClick={() => {
        navigate(`/notes/${props.id}`);
      }}
    >
      <h3 className="note-h3">{props.title}</h3>
      <p className="note-p">{props.content}</p>
      <button
        className="note-delete-button"
        onClick={(event) => {
          props.deleteNote(props.id);
          event.stopPropagation();
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
