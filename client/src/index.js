import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { CookiesProvider } from "react-cookie";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login.jsx";
import FullNotePage from "./pages/FullNotePage.jsx";
import NotebooksPage from "./pages/NotebooksPage.jsx";
import NotebookPage from "./pages/NotebookPage.jsx";
import Logout from "./components/Logout.jsx";

const cookies = document.cookie;
const isLoggedIn = cookies.includes("LoggedIn=true");
console.log(cookies);
console.log(`isLoggedIn ${isLoggedIn}`);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/notes/:noteId",
    element: <FullNotePage />,
  },
  {
    path: "/notebooks",
    element: <NotebooksPage />,
  },
  {
    path: "/notebook/:notebookId",
    element: <NotebookPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  </React.StrictMode>
);
