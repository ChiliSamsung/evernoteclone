import React, { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Header from "../components/Header";
import FormInput from "../components/FormInput";
import FormTextArea from "../components/FormTextArea";

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

  /** button click or update event handlers */
  function handleSelectorChange(event) {
    const selectedNotebookId = event.target.value;
    setSelectedNotebookId(selectedNotebookId);
  }

  function saveEditButtonClick() {
    if (isInEditMode) {
      handleSaveEditNote();
    }
    setIsInEditMode(!isInEditMode);
  }

  function deleteButtonClick() {
    deleteNote();
    navigate("/");
  }

  /** calls to backend API */
  function deleteNote() {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`/notes/${cookies.LoggedInUsername}/${noteId}`, requestOptions);
  }

  function handleSaveEditNote() {
    //save the note title,content update. Then save note into notebook
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: noteData.title,
        content: noteData.content,
      }),
    };
    fetch(`/notes/${cookies.LoggedInUsername}/${noteId}`, requestOptions, []);
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
    fetch(`/notes/${cookies.LoggedInUsername}/${noteId}`)
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
    fetch(`/notebooks/${cookies.LoggedInUsername}`)
      .then((res) => res.json())
      .then((responseJson) => {
        setNotebooks(responseJson);
        setSelectedNotebookId(responseJson[0]._id);
      });
  }, [cookies, navigate]);

  let fullNoteContent;
  if (isInEditMode) {
    fullNoteContent = (
      <form className="edit-note" autoComplete="off">
        <FormInput
          labelTitle="Title:"
          labelName="title"
          type="text"
          labelValue={noteData.title}
          setFormData={setNoteData}
        />
        <FormTextArea
          labelTitle="Content:"
          name="content"
          value={noteData.content}
          numRows="5"
          setFormData={setNoteData}
        />

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
          <button onClick={saveEditButtonClick}>
            {isInEditMode ? <SaveIcon /> : <EditIcon />}
          </button>
          <button onClick={deleteButtonClick}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
