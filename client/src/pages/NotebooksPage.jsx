import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import FormSubmitButton from "../components/FormSubmitButton";

export default function NotebooksPage() {
  const [cookies] = useCookies(["user"]);
  const [notebooksList, setNotebooksList] = useState([]);
  const [addNotebookEnabled, setAddNotebookEnabled] = useState(false);
  const [notebookName, setNotebookName] = useState({
    name: "",
  });
  const navigate = useNavigate();
  const emptyNotebookName = "{No Name}";

  //load notebooks for current user
  useEffect(() => {
    const queryString = `/notebooks/${cookies.LoggedInUsername}`;
    fetch(queryString)
      .then((res) => res.json())
      .then((responseJson) => {
        setNotebooksList([...responseJson]);
      });
  }, [cookies]);

  function addNotebook() {
    const query = `/${cookies.LoggedInUsername}/newnotebook`;
    const requestBody = {
      notebookName: notebookName.name,
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

  const addNotebookComponent = addNotebookEnabled ? (
    <form>
      <FormInput
        labelTitle="Notebook:"
        labelName="name"
        placeholder="New notebook name"
        labelValue={notebookName.name}
        setFormData={setNotebookName}
        customClassName="add-notebook-input"
      />
      <FormSubmitButton
        buttonTitle="Submit"
        submitHandler={addNotebook}
        customClassName={"add-notebook btn btn-md btn-primary btn-block"}
      />
    </form>
  ) : (
    <button
      className="add-notebook btn btn-md btn-primary btn-block"
      onClick={() => {
        setAddNotebookEnabled(true);
      }}
    >
      Add Notebook
    </button>
  );

  return (
    <div>
      <Header />
      <div className="add-notebook-container">{addNotebookComponent}</div>
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
              <h3>{notebook.name ? notebook.name : emptyNotebookName}</h3>
              <p>{notebook.notes.length} Notes</p>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
