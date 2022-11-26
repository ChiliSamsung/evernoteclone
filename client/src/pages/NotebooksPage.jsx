import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function NotebooksPage() {
  const [cookies] = useCookies(["user"]);
  const [notebooksList, setNotebooksList] = useState([]);
  const [addNotebookEnabled, setAddNotebookEnabled] = useState(false);
  const [notebookName, setNotebookName] = useState("");
  const navigate = useNavigate();

  //load notebooks for current user
  useEffect(() => {
    const queryString = `/notebooks/${cookies.LoggedInUsername}`;
    fetch(queryString)
      .then((res) => res.json())
      .then((responseJson) => {
        setNotebooksList([...responseJson]);
      });
  }, [cookies]);

  function handleAddNotebookChange(event) {
    const { value } = event.target;
    setNotebookName(value);
  }

  function addNotebook() {
    const query = `/${cookies.LoggedInUsername}/newnotebook`;
    const requestBody = {
      notebookName: notebookName,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    };
    fetch(query, requestOptions).then((res) => {
      console.log(res);
      if (res.ok) {
        const queryString = `/notebooks/${cookies.LoggedInUsername}`;
        fetch(queryString)
          .then((res) => res.json())
          .then((responseJson) => {
            setNotebooksList([...responseJson]);
          });
      }
      setNotebookName("");
      setAddNotebookEnabled(false);
    });
  }

  const addNotebookComponent = (
    <div className="add-notebook-container">
      <form>
        <label>Notebook:</label>
        <input
          value={notebookName}
          placeholder="Notebook name"
          onChange={handleAddNotebookChange}
        ></input>
        <button
          onClick={(event) => {
            event.preventDefault();
            addNotebook();
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );

  return (
    <div>
      <Header />
      {addNotebookEnabled && addNotebookComponent}
      {!addNotebookEnabled && (
        <button
          className="add-notebook"
          onClick={() => {
            setAddNotebookEnabled(true);
          }}
        >
          Add Notebook
        </button>
      )}
      <ul>
        {notebooksList.map((notebook) => {
          return (
            <div
              className="notebook-container"
              key={notebook._id}
              onClick={() => {
                navigate(`/notebook/${notebook._id}`);
              }}
            >
              <h3>{notebook.name}</h3>
              <p>{notebook.notes.length} Notes</p>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
