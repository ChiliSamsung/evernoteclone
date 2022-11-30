import React from "react";

function FormSubmitButton(props) {
  return (
    <button
      className={props.customClassName}
      type="submit"
      onClick={(event) => {
        props.submitHandler();
        event.preventDefault();
      }}
    >
      {props.buttonTitle}
    </button>
  );
}

export default FormSubmitButton;
