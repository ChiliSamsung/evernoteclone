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

//Use this wrapper to protect routes which user needs to be authenticated
//in order to see. Gets executed automatically
const ProtectedRoute = ({ children }) => {
  const cookies = document.cookie;
  const isLoggedIn = cookies.includes("LoggedIn=true");
  console.log(`${Date.now()} isLoggedIn ${isLoggedIn}`);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = // Configure nested routes with JSX
  createBrowserRouter(
    createRoutesFromElements([
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
        errorElement=<ErrorPage />
      />,
      <Route path="login" element={<Login />} />,
      <Route
        path="notes/:noteId"
        element={
          <ProtectedRoute>
            <FullNotePage />{" "}
          </ProtectedRoute>
        }
      />,
      <Route
        path="notebooks"
        element={
          <ProtectedRoute>
            <NotebooksPage />{" "}
          </ProtectedRoute>
        }
      />,
      <Route
        path="notebook/:notebookId"
        element={
          <ProtectedRoute>
            <NotebookPage />{" "}
          </ProtectedRoute>
        }
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
