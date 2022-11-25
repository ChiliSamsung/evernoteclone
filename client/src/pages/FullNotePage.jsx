import React, { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Header from "../components/Header";

export default function FullNotePage(props) {
  const navigate = useNavigate();
  const [noteData, setNoteData] = React.useState({
    title: "",
    content: "",
  });
  const [cookies] = useCookies(["user"]);
  const [isInEditMode, setIsInEditMode] = React.useState(false);
  const { noteId } = useParams();

  function deleteNote() {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`/notes/${cookies.LoggedInUsername}/${noteId}`, requestOptions);
  }

  function handleFormUpdate(event) {
    const { name, value } = event.target;
    setNoteData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function handleSaveEditNote() {
    const newNote = { title: noteData.title, content: noteData.content };
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    };
    fetch(`/notes/${cookies.LoggedInUsername}/${noteId}`, requestOptions, []);
  }

  console.log(cookies.LoggedInUsername + " " + noteId);

  //load note data
  useEffect(() => {
    const queryString = `/notes/${cookies.LoggedInUsername}/${noteId}`;
    fetch(queryString)
      .then((res) => res.json())
      .then((responseJson) => {
        setNoteData({
          title: responseJson.title,
          content: responseJson.content,
        });
      });
  }, [cookies, navigate, noteId]);

  let icon;
  if (isInEditMode) {
    icon = <SaveIcon />;
  } else {
    icon = <EditIcon />;
  }

  let fullNoteContent;
  if (isInEditMode) {
    fullNoteContent = (
      <form className="edit-note" autoComplete="off">
        <input
          name="title"
          type="text"
          value={noteData.title}
          onChange={handleFormUpdate}
        />
        <textarea
          name="content"
          placeholder="Lorem Ipsum"
          value={noteData.content}
          rows="5"
          onChange={handleFormUpdate}
        />
      </form>
    );
  } else {
    fullNoteContent = (
      <div>
        <h1>{noteData.title}</h1>
        <p>{noteData.content}</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="note-page">
        {fullNoteContent}
        <div className="note-page-button-container">
          <button
            onClick={() => {
              if (isInEditMode) {
                handleSaveEditNote();
              }
              setIsInEditMode(!isInEditMode);
            }}
          >
            {icon}
          </button>

          <button
            onClick={() => {
              deleteNote();
              navigate("/");
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
