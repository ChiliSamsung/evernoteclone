import React from "react";
import Header from "../components/Header.jsx";

export default function Login() {

    const [loginResultString, setLoginResult] = React.useState(null);
    
    const [loginData, setLoginData] = React.useState({
        username: "",
        password: "",
    });

    function handleLoginUpdate(event) {
        const {name, value} = event.target;
        setLoginData((prevValue) => {
            return {
                ...prevValue,
                [name] : value
            };
        });
    }

    function handleSubmitLogin() {
        const username = loginData.username;
        const password = loginData.password;
        const queryString = `/login?username=${username}&password=${password}`;
        console.log(queryString);
        fetch(queryString)
            .then((res) => res.json())
            .then((responseJson) => {
            console.log(responseJson);
            setLoginResult(responseJson);
            })


            what
    }


    return (
        <div>
            <Header />
            <div className="login-form">
                <form autoComplete="off">

                    <div className="login-input">
                        <label>Username:</label>
                        <input type="text" name="username" 
                               placeholder="Name" value={loginData.username} 
                               onChange={handleLoginUpdate}
                        />
                    </div>
                    <div className="login-input">
                        <label>Password:</label>
                        <input type="password" name="password" 
                               value={loginData.password}
                               onChange={handleLoginUpdate}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-submit" 
                        onClick={(event) => {
                            handleSubmitLogin();
                            event.preventDefault();
                        }}    
                    >Submit</button>

                    <p>{!loginResultString ? "Login result pending..." : loginResultString}</p>
                </form>
            </div>
        </div>
    )
}