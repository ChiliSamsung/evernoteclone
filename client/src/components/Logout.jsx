import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

//no content is rendered, only used for hanlding request and then redirects
function Logout() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const cookieOptions = {
    path: "/",
    sameSite: "lax",
  };

  async function logout() {
    removeCookie("LoggedIn", cookieOptions);
    removeCookie("LoggedInUsername", cookieOptions);
    //await timeout(3000);
  }

  useEffect(() => {
    logout().then(() => {
      navigate("/", { replace: true });
    });
  }, []);

  return <p>Loading...</p>;
}

//only for testing a long API call and the "loading" icon.
function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

export default Logout;
