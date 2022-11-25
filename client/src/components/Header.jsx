import React from "react";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header
      onClick={() => {
        navigate("/");
      }}
    >
      <h1>
        <span>
          <TextSnippetIcon />
        </span>
        Evernote Clone
      </h1>
    </header>
  );
}

export default Header;
