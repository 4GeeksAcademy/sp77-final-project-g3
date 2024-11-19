// ./pages/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

const ProtectedRoute = ({ children }) => {
	const { store } = useContext(Context);
	const isAuthenticated = store.isLogged && localStorage.getItem("token");

	// console.log("isAuthenticated:", isAuthenticated);
	// console.log("store.isLogged:", store.isLogged);
	// console.log("localStorage token:", localStorage.getItem("token"));

	return isAuthenticated ? children : <Navigate to="/login" />;
};


export { ProtectedRoute };
