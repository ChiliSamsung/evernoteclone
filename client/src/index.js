import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './routes/Home.jsx';
import ErrorPage from "./pages/Error-Page.jsx";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
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
        <RouterProvider router={router} />
    </React.StrictMode>
);
