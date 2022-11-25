import React from "react";

function CreateNoteArea(props) {
  const [formInfo, setFormInfo] = React.useState({
    title: "",
    content: "",
  });

  function handleFormUpdate(event) {
    const { name, value } = event.target;
    setFormInfo((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  return (
    <div>
      <form className="create-note" autoComplete="off">
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={formInfo.title}
          onChange={handleFormUpdate}
        />
        <textarea
          name="content"
          placeholder="Lorem Ipsum"
          value={formInfo.content}
          rows="3"
          onChange={handleFormUpdate}
        />

        <button
          type="submit"
          onClick={(event) => {
            props.addNote(formInfo);
            setFormInfo({
              title: "",
              content: "",
            });
            event.preventDefault();
          }}
        >
          +
        </button>
      </form>
    </div>
  );
}

export default CreateNoteArea;
