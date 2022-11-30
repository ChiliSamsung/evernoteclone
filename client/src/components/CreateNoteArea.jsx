import React from "react";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import FormTextArea from "./FormTextArea";

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
          placeholder="Title"
          labelValue={formInfo.title}
          setFormData={setFormInfo}
        />
        <FormTextArea
          name="content"
          placeholder="Note Content Lorem Ipsum"
          value={formInfo.content}
          numRows="3"
          setFormData={setFormInfo}
        />
        <FormSubmitButton
          buttonTitle="+"
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
