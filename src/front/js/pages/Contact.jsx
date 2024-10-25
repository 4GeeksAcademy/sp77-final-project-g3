import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";


export const Contact = () => {
	const { store, actions } = useContext(Context);

	return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="container-flex mt-5">
                        <form>
                            <p className="text-center"> Contact Us</p>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerName">
                                    First Name
                                </label>
                                <input type="text" id="registerName" className="form-control" />
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerLastname">
                                    Last Name
                                </label>
                                <input type="text" id="registerLastname" className="form-control" />
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerEmail">
                                    Email
                                </label>
                                <input type="email" id="registerEmail" className="form-control" />
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" >
                                    Your message:
                                </label>
                                <textarea className="form-control textarea-large" aria-label="With textarea"/>
                            </div>
                        </form>
                    </div>
                </div>
    );
};
