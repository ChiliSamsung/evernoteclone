import React from "react";

function FormInput(props) {
  /* form input receives value and setter and uses them 
  to update the passed data object with its own state,
  plus the values of any other inputs are preserved.
  */
  function handleInputUpdate(event) {
    const { name, value } = event.target;
    props.setFormData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  return (
    <div className={props.customClassName}>
      {props.labelTitle && (
        <label className="form-label">{props.labelTitle}</label>
      )}
      <input
        type={props.type}
        name={props.labelName}
        value={props.labelValue}
        placeholder={props.placeholder}
        className="form-control"
        onChange={handleInputUpdate}
      />
    </div>
  );
}

export default FormInput;
