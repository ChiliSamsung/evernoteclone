import React from "react";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <h1
        onClick={() => {
          navigate("/");
        }}
      >
        <span>
          <TextSnippetIcon />
        </span>
        Evernote Clone
      </h1>
      <div className="header-end-items">
        <h4
          onClick={() => {
            navigate("/logout");
          }}
        >
          Sign out
        </h4>
      </div>
    </header>
  );
}

export default Header;
