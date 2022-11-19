import React from "react";

function CreateNoteArea(props) {
    const [formInfo, setFormInfo] = React.useState({
        formTitle: "",
        formContent: ""
    })
    
    function handleFormUpdate(event) {
        const {name, value} = event.target;
        setFormInfo(prevValue => {
            return (
                {
                    ...prevValue,
                    [name]: value
                }
            )
        })
    }


    return (
        <div>
            <form className="create-note">
                <input 
                    name="title" 
                    type="text" 
                    placeholder="Title" 
                    onChange={handleFormUpdate} 
                />
                <textarea 
                    name="content"
                    placeholder="Lorem Ipsum" 
                    rows="3" 
                    onChange={handleFormUpdate} 
                />

                <button type="submit" onClick={(event) => {
                    props.addNote(formInfo);
                    event.preventDefault();
                }}>+</button>


            </form>

        </div>
    )
}


export default CreateNoteArea;