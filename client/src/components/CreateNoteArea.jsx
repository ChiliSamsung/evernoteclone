import React from "react";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import FormTextArea from "./FormTextArea";
import AddIcon from "@mui/icons-material/Add";

function CreateNoteArea(props) {
  const [formInfo, setFormInfo] = React.useState({
    title: "",
    content: "",
  });

  return (
    <div>
      <form className="create-note" autoComplete="off">
        <FormInput
          type="text"
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
        <FormSubmitButton
          buttonTitle={<AddIcon />}
          customClassName="add-note-button"
          submitHandler={() => {
            props.addNote(formInfo);
            setFormInfo({
              title: "",
              content: "",
            });
          }}
        />
      </form>
    </div>
  );
}

export default CreateNoteArea;
