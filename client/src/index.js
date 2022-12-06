import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { CookiesProvider } from "react-cookie";

import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import Login from "./routes/Login.jsx";
import FullNotePage from "./pages/FullNotePage.jsx";
import NotebooksPage from "./pages/NotebooksPage.jsx";
import NotebookPage from "./pages/NotebookPage.jsx";
import Logout from "./components/Logout.jsx";

//redirect to login page if user is not logged in. Can't use on the Home route cause
//react does not page refresh on navigate("/"). It's part of how react tries to avoid refreshes.
function showIfLoggedIn(element) {
  const cookies = document.cookie;
  const isLoggedIn = cookies.includes("LoggedIn=true");
  console.log(`isLoggedIn ${isLoggedIn}`);
  return isLoggedIn ? element : <Navigate replace to={"/login"} />;
}

const router = // Configure nested routes with JSX
  createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" element={<Home />} errorElement=<ErrorPage /> />,
      <Route path="login" element={<Login />} />,
      <Route path="notes/:noteId" element={showIfLoggedIn(<FullNotePage />)} />,
      <Route path="notebooks" element={showIfLoggedIn(<NotebooksPage />)} />,
      <Route
        path="notebook/:notebookId"
        element={showIfLoggedIn(<NotebookPage />)}
      />,
      <Route path="logout" element={<Logout />} />,
    ])
  );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  </React.StrictMode>
);
