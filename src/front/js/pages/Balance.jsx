import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";


export const Balance = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container pt-5 d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
			<img src="https://i.ibb.co/nDx7b9g/wip-2.jpg" alt="Work in progress" className="img-fluid"/>
		</div>
	);
};
