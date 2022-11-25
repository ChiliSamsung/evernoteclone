import React from "react";
import Header from "../components/Header.jsx";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Login() {
  //variables
  const [loginResultString, setLoginResult] = React.useState(null);
  const [loginData, setLoginData] = React.useState({
    username: "",
    password: "",
  });
  const [cookie, setCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  //functions
  function handleLoginUpdate(event) {
    const { name, value } = event.target;
    setLoginData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
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
        if (responseJson !== "Incorrect Login") {
          const options = {
            path: "/",
            maxAge: 1800,
            sameSite: "lax",
          };
          setLoginResult("Login Success");
          setCookie("LoggedIn", true, options);
          setCookie("LoggedInUsername", responseJson, options);
          navigate("/");
        } else {
          setLoginResult("Login Failed. Try Again");
        }
      });
  }

  function handleSubmitRegister() {
    const newUser = {
      username: loginData.username,
      password: loginData.password,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    };
    fetch("/register", requestOptions).then((res) => {
      console.log(res);
      if (res.ok) {
        setLoginResult(`Register succeeded Try logging in.`);
      } else {
        setLoginResult(`Register failed.`);
      }
    });
  }

  return (
    <div>
      <Header />
      <div className="login-form">
        <form autoComplete="off">
          <div className="login-input">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Name"
              value={loginData.username}
              onChange={handleLoginUpdate}
            />
          </div>
          <div className="login-input">
            <label>Password:</label>
            <input
              type="password"
              name="password"
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
          >
            Login
          </button>

          <button
            type="submit"
            onClick={(event) => {
              handleSubmitRegister();
              event.preventDefault();
            }}
          >
            Register
          </button>

          <p>
            {!loginResultString ? "Login result pending..." : loginResultString}
          </p>
        </form>
      </div>
    </div>
  );
}
