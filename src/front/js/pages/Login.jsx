import React, { useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const { actions, store } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRepeatPassword, setRegisterRepeatPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleEmail = (event) => setEmail(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);
    const handleRegisterEmail = (event) => setRegisterEmail(event.target.value);
    const handleRegisterPassword = (event) => setRegisterPassword(event.target.value);
    const handleRegisterRepeatPassword = (event) => setRegisterRepeatPassword(event.target.value);

    const handleSubmitLogin = async (event) => {
        event.preventDefault();
        const dataToSend = { email, password };
        const success = await actions.login(dataToSend);
        if (success) {
            navigate('/dashboard');
        } else {
            setErrorMessage(store.message); 
        }
    };

    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        if (registerPassword !== registerRepeatPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        const dataToSend = { email: registerEmail, password: registerPassword };
        const success = await actions.signup(dataToSend);
        if (success) {
            navigate('/dashboard');
        } else {
            setErrorMessage(store.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="container-flex mt-5">
                <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a className="nav-link active" id="tab-login" data-bs-toggle="pill" href="#pills-login" role="tab" aria-controls="pills-login" aria-selected="true">
                            Login
                        </a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="tab-register" data-bs-toggle="pill" href="#pills-register" role="tab" aria-controls="pills-register" aria-selected="false">
                            Register
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                        <form onSubmit={handleSubmitLogin}>
                            <div className="text-center mb-3">
                                <p>Sign in with:</p>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-facebook-f" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-google" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-github" style={{ color: '#2D3748' }}></i>
                                </button>
                            </div>
                            <p className="text-center">or:</p>
                            <div className="form-outline mb-4">
                                <input type="email" id="loginName" required aria-label="Email" value={email} onChange={handleEmail} className="form-control" />
                                <label className="form-label" htmlFor="loginName">Email</label>
                            </div>
                            <div className="form-outline mb-2">
                                <input type="password" id="loginPassword" required value={password} onChange={handlePassword} className="form-control" />
                                <label className="form-label" htmlFor="loginPassword">Password</label>
                                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-12 d-flex ">
                                    <Link to="/forgot-password" style={{ color: '#2D3748' }}>Lost password?</Link>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-block mb-4" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>
                                Sign in
                            </button>
                        </form>
                    </div>
                    <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                        <form onSubmit={handleSubmitRegister}>
                            <div className="text-center mb-3">
                                <p>Sign up with:</p>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-facebook-f" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-google" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-github" style={{ color: '#2D3748' }}></i>
                                </button>
                            </div>
                            <p className="text-center">or:</p>
                            <div className="form-outline mb-4">
                                <input type="email" id="registerEmail" value={registerEmail} onChange={handleRegisterEmail} className="form-control" required />
                                <label className="form-label" htmlFor="registerEmail">Email</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="registerPassword" value={registerPassword} onChange={handleRegisterPassword} className="form-control" required />
                                <label className="form-label" htmlFor="registerPassword">Password</label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="registerRepeatPassword" value={registerRepeatPassword} onChange={handleRegisterRepeatPassword} className="form-control" required />
                                <label className="form-label" htmlFor="registerRepeatPassword">Repeat password</label>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block mb-3" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>
                                Sign up
                            </button>
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
