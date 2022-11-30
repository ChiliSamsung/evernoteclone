import React from "react";

function FormSubmitButton(props) {
  return (
    <button
      className="login-submit"
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
