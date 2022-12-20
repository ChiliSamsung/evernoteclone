import React, { useEffect } from "react";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import FormTextArea from "./FormTextArea";
import AddIcon from "@mui/icons-material/Add";

function CreateNoteArea(props) {
  const userId = props.userId;
  const [formInfo, setFormInfo] = React.useState({
    title: "",
    content: "",
    tags: [],
  });
  const [existingTags, setExistingTags] = React.useState([]);
  const [selectorValue, setSelectorValue] = React.useState("");

  //when new tag is selected
  function handleOptionSelected(event) {
    const newTag = event.target.value;
    setSelectorValue(newTag);
    const currentTags = formInfo.tags;
    //can have at most 3 tags on a note
    if (currentTags.length < 4 && !currentTags.includes(newTag)) {
      const newTags = formInfo.tags.concat(newTag);
      setFormInfo((oldInfo) => {
        return {
          ...oldInfo,
          tags: newTags,
        };
      });
    }
  }

  //load existing tags
  useEffect(() => {
    fetch(`/tags/${userId}`)
      .then((res) => res.json())
      .then((responseJson) => {
        setExistingTags(responseJson);
      });
  }, [userId]);

  return (
    <div>
      <form className="create-note" autoComplete="off">
        <FormInput
          type="text"
          customClassName="mb-1"
          labelName="title"
          placeholder="Note Title"
          labelValue={formInfo.title}
          setFormData={setFormInfo}
        />
        <FormTextArea
          name="content"
          placeholder="Add content to the note here"
          value={formInfo.content}
          numRows="3"
          setFormData={setFormInfo}
        />

        <label>Tags:</label>
        <select
          className="form-select notebook-selector mt-3"
          onChange={handleOptionSelected}
          value={selectorValue}
        >
          <option></option>
          {existingTags.map((tag, index) => {
            return <option key={index}>{tag}</option>;
          })}
        </select>

        <div className="mt-3">
          {formInfo.tags.slice(0, 3).map((tag, index) => {
            return (
              <button className="btn btn-outline-secondary" key={index}>
                <span className="tag-button-text">{tag}</span>
              </button>
            );
          })}
        </div>

        <FormSubmitButton
          buttonTitle={<AddIcon />}
          customClassName="add-note-button create-note-button"
          submitHandler={() => {
            props.addNote(formInfo);
            setFormInfo({
              title: "",
              content: "",
              tags: [],
            });
            setSelectorValue("");
          }}
        />
      </form>
    </div>
  );
}

export default CreateNoteArea;
