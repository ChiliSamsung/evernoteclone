import React, { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Header from "../components/Header";

export default function FullNotePage() {
  const navigate = useNavigate();
  const [noteData, setNoteData] = React.useState({
    title: "",
    content: "",
  });
  const [isInEditMode, setIsInEditMode] = React.useState(false);
  const [selectedNotebookId, setSelectedNotebookId] = React.useState("");
  const [notebooks, setNotebooks] = React.useState([]);
  const [cookies] = useCookies(["user"]);
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
    //save the note title,content update
    const newNote = { title: noteData.title, content: noteData.content };
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    };
    fetch(`/notes/${cookies.LoggedInUsername}/${noteId}`, requestOptions, []);
    //save the note in new notebook
    const notebookRequestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId: noteId }),
    };
    fetch(
      `/${cookies.LoggedInUsername}/${selectedNotebookId}`,
      notebookRequestOptions,
      []
    );
  }

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

  //load notebook list
  useEffect(() => {
    const queryString = `/notebooks/${cookies.LoggedInUsername}`;
    fetch(queryString)
      .then((res) => res.json())
      .then((responseJson) => {
        setNotebooks(responseJson);
        setSelectedNotebookId(responseJson[0]._id);
      });
  }, [cookies, navigate]);

  //handle selector change
  function handleSelectorChange(event) {
    const selectedNotebookId = event.target.value;
    setSelectedNotebookId(selectedNotebookId);
  }

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
        <label>
          Title:
          <input
            name="title"
            type="text"
            value={noteData.title}
            onChange={handleFormUpdate}
          />
        </label>
        <label>
          Content:
          <textarea
            name="content"
            placeholder="Lorem Ipsum"
            value={noteData.content}
            rows="5"
            onChange={handleFormUpdate}
          />
        </label>
        <label>
          Notebook:
          <select value={selectedNotebookId} onChange={handleSelectorChange}>
            {notebooks.map((notebook, index) => {
              return (
                <option key={index} value={notebook._id}>
                  {notebook.name}
                </option>
              );
            })}
          </select>
        </label>
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
