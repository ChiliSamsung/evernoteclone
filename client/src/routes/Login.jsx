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
  // eslint-disable-next-line no-unused-vars
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
      <div class="login-form">
        <img
          className="mb-4"
          src="../images/notebook-smile.png"
          alt="icon"
          width="108"
          height="108"
        />
        <h5 className="login-header">
          {!loginResultString
            ? "Sign In or Register new Account"
            : loginResultString}
        </h5>

        <form autoComplete="off">
          <FormInput
            customClassName="login-input"
            type="text"
            labelName="username"
            placeholder="Username"
            labelValue={loginData.username}
            setFormData={setLoginData}
          />
          <FormInput
            customClassName="login-input"
            type="password"
            labelName="password"
            placeholder="Password"
            labelValue={loginData.password}
            setFormData={setLoginData}
          />
          <FormSubmitButton
            customClassName="login-submit btn btn-md btn-primary btn-block"
            submitHandler={handleLogin}
            buttonTitle="Login"
          />
          <FormSubmitButton
            customClassName="login-submit btn btn-md btn-primary btn-block"
            submitHandler={handleRegister}
            buttonTitle="Register"
          />
        </form>
      </div>
    </div>
  );
}
