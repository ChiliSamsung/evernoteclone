import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './routes/Home.jsx';
import ErrorPage from "./pages/Error-Page.jsx";
import { CookiesProvider } from "react-cookie";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/Login.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />
    },
    {
        path: "/login",
        element: <Login />
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <CookiesProvider>
            <RouterProvider router={router} />
        </CookiesProvider>
    </React.StrictMode>
);
