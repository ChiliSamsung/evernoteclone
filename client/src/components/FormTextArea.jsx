import React from "react";

function FormTextArea(props) {
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
    <div>
      {props.labelTitle && (
        <label className="form-label">{props.labelTitle}</label>
      )}
      <textarea
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        rows={props.numRows}
        className={`form-control ${props.customClassName}`}
        onChange={handleInputUpdate}
      />
    </div>
  );
}

export default FormTextArea;
