import React from "react";
import { Link } from "react-router-dom";


export const Login = () => {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="container-flex mt-5">
                {/* Pills navs */}
                <ul className="nav nav-pills nav-justified mb-3 " id="ex1" role="tablist"  >
                    <li className="nav-item" role="presentation" >
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
                        <form>
                            <div className="text-center mb-3">
                                <p>Sign in with:</p>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-facebook-f" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-google" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-twitter" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-github" style={{ color: '#2D3748' }}></i>
                                </button>
                            </div>
                            <p className="text-center">or:</p>
                            <div className="form-outline mb-4">
                                <input type="email" id="loginName" className="form-control" />
                                <label className="form-label" htmlFor="loginName">
                                    Email
                                </label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="loginPassword" className="form-control" />
                                <label className="form-label" htmlFor="loginPassword" >
                                    Password
                                </label>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6 d-flex justify-content-center">
                                    <div className="form-check mb-3 mb-md-0 custom-checkbox">
                                        <input className="form-check-input" type="checkbox" id="loginCheck" defaultChecked  />
                                        <label className="form-check-label " htmlFor="loginCheck" >
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex justify-content-center">
                                    <Link to="/forgot-password" style={{ color: '#2D3748' }}>Lost password?</Link>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-block mb-4" style={{ backgroundColor: '#2D3748', color: '#E2E8F0'}}>
                                Sign in
                            </button>
                        </form>
                    </div>
                    <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                        <form>
                            <div className="text-center mb-3">
                                <p>Sign up with:</p>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-facebook-f" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-google" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-twitter" style={{ color: '#2D3748' }}></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                    <i className="fab fa-github" style={{ color: '#2D3748' }}></i>
                                </button>
                            </div>
                            <p className="text-center">or:</p>
                            <div className="form-outline mb-4">
                                <input type="text" id="registerName" className="form-control" />
                                <label className="form-label" htmlFor="registerName">
                                    First Name
                                </label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="text" id="registerLastname" className="form-control" />
                                <label className="form-label" htmlFor="registerLastname">
                                    Last Name
                                </label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="email" id="registerEmail" className="form-control" />
                                <label className="form-label" htmlFor="registerEmail">
                                    Email
                                </label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="registerPassword" className="form-control" />
                                <label className="form-label" htmlFor="registerPassword">
                                    Password
                                </label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="registerRepeatPassword" className="form-control" />
                                <label className="form-label" htmlFor="registerRepeatPassword">
                                    Repeat password
                                </label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="tel" id="registerPhone" className="form-control" />
                                <label className="form-label" htmlFor="registerPhone">
                                    Phone Number
                                </label>
                            </div>
                            <div className="form-check d-flex justify-content-center mb-4 custom-checkbox">
                                <input className="form-check-input me-2" type="checkbox" id="registerCheck" defaultChecked />
                                <label className="form-check-label" htmlFor="registerCheck">
                                    I have read and agree to the terms
                                </label>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block mb-3" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} >
                                Sign up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
};