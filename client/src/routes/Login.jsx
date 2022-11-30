import React from "react";
import Header from "../components/Header.jsx";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import FormSubmitButton from "../components/FormSubmitButton.jsx";

export default function Login() {
  //variables
  const [loginResultString, setLoginResult] = React.useState("");
  const [loginData, setLoginData] = React.useState({
    username: "",
    password: "",
  });
  const [cookies, setCookie] = useCookies(["user"]);
  const cookieOptions = {
    path: "/",
    maxAge: 1800,
    sameSite: "lax",
  };
  const navigate = useNavigate();

  //functions
  function handleLogin() {
    fetch(
      `/login?username=${loginData.username}&password=${loginData.password}`
    )
      .then((res) => res.json())
      .then((responseJson) => {
        if (responseJson !== "Incorrect Login") {
          setCookie("LoggedIn", true, cookieOptions);
          setCookie("LoggedInUsername", responseJson, cookieOptions);
          navigate("/");
        } else {
          setLoginResult("Login Failed. Try Again");
        }
      });
  }

  function handleRegister() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginData.username,
        password: loginData.password,
      }),
    };
    fetch("/register", requestOptions).then((res) => {
      const result = res.ok ? "Register succeeded." : "Register failed.";
      setLoginResult(result);
    });
  }

  return (
    <div>
      <Header />
      <div className="login-form">
        <form autoComplete="off">
          <FormInput
            customClassName="login-input"
            type="text"
            labelTitle="Username:"
            labelName="username"
            labelValue={loginData.username}
            setFormData={setLoginData}
          />
          <FormInput
            customClassName="login-input"
            type="password"
            labelTitle="Password:"
            labelName="password"
            labelValue={loginData.password}
            setFormData={setLoginData}
          />
          <FormSubmitButton
            customClassName="login-submit"
            submitHandler={handleLogin}
            buttonTitle="Login"
          />
          <FormSubmitButton
            customClassName="login-submit"
            submitHandler={handleRegister}
            buttonTitle="Register"
          />
          <p>
            {!loginResultString
              ? "Sign In or Register new Account"
              : loginResultString}
          </p>
        </form>
      </div>
    </div>
  );
}
