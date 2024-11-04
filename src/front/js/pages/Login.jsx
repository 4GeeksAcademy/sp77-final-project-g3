// src/front/js/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "/workspaces/sp77-final-project-g3/src/firebase/firebase";
import { useAuth } from "/workspaces/sp77-final-project-g3/src/contexts/authContext/index.jsx";
import { doSignInWithGoogle, doSignInWithFacebook, doSignInWithGithub, doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword } from "/workspaces/sp77-final-project-g3/src/firebase/auth";

export const Login = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

<<<<<<< HEAD
    const handleEmail = (event) => setEmail(event.target.value)
    const handlePassword = (event) => setPassword(event.target.value)
    const handleGetToken = (event) => {
        actions.getToken();
        console.log("Token obtenido al hacer clic en Home");
=======
    // State for Login/Register
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    // State for Profile Completion
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Function to handle conditional login redirect
    useEffect(() => {
        const checkLoginStatus = async () => {
            await handleLogin();
        };
    
        checkLoginStatus();
    }, [currentUser, navigate]);
    
    const handleLogin = async () => {
        try {
            if (currentUser && currentUser.uid) {
                console.log("Logged in with UID:", currentUser.uid);
                navigate("/dashboard");  // Redirect to /dashboard if logged in
            } else {
                console.log("User is not logged in or UID is not available.");
            }
        } catch (error) {
            console.error("Error during login:", error.message);
        }
    };

    // Email-based Login or Registration
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            if (isRegistering) {
                // Register new user with additional fields
                const userCredential = await doCreateUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                await setDoc(doc(db, "users", user.uid), {
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber
                });
                
                navigate("/profile");
            } else {
                // Login existing user
                await doSignInWithEmailAndPassword(email, password);
                navigate("/dashboard");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Provider Sign-In/Sign-Up
    const handleProviderSignUp = async (signInFunction) => {
        try {
            const userCredential = await signInFunction();
            const user = userCredential.user;

            if (user && user.uid) {  // Check if user and user.uid exist
                // Store basic data in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    first_name: user.displayName ? user.displayName.split(" ")[0] : null,
                    last_name: user.displayName ? user.displayName.split(" ")[1] : null,
                    photo_url: user.photoURL,
                });
                
                // Redirect to profile completion
                setIsProfileComplete(true);
            } else {
                console.log("No UID available for this user.");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
>>>>>>> 4fd6871e078023400cec1cca8871ad979baed676
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = { email, password }
        console.log(dataToSend);
        actions.login(dataToSend);
<<<<<<< HEAD
        navigate('/dashboard')
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="container-flex mt-5">
                {/* Pills navs */}
                <ul className="nav nav-pills nav-justified mb-3 " id="ex1" role="tablist"  >
                    <li className="nav-item" role="presentation" >
                        <a className="nav-link active" id="tab-login" data-bs-toggle="pill" href="#pills-login" role="tab" aria-controls="pills-login" aria-selected="true" onClick={handleGetToken}>
=======
        navigate('/profile')
      }
      
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="container-flex mt-5">
                <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${!isRegistering ? "active" : ""}`} onClick={() => setIsRegistering(false)}>
>>>>>>> 4fd6871e078023400cec1cca8871ad979baed676
                            Login
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className={`nav-link ${isRegistering ? "active" : ""}`} onClick={() => setIsRegistering(true)}>
                            Register
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
<<<<<<< HEAD
                    <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                        <form onSubmit={handleSubmit} >
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
                                <input type="email" id="loginName" required aria-label="Email" value={email} onChange={handleEmail} className="form-control" />
                                <label className="form-label" htmlFor="loginName">
                                    Email
                                </label>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="password" id="loginPassword" required value={password} onChange={handlePassword} className="form-control" />
                                <label className="form-label" htmlFor="loginPassword" >
                                    Password
                                </label>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-6 d-flex justify-content-center">
                                    <div className="form-check mb-3 mb-md-0 custom-checkbox">
                                        <input className="form-check-input" type="checkbox" id="loginCheck" defaultChecked />
                                        <label className="form-check-label " htmlFor="loginCheck" >
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex justify-content-center">
                                    <Link to="/forgot-password" style={{ color: '#2D3748' }}>Lost password?</Link>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-block mb-4" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>
                                Sign in
=======
                    <form onSubmit={handleEmailSubmit}>
                        <div className="text-center mb-3">
                            <p>{isRegistering ? "Sign up with:" : "Sign in with:"}</p>
                            <button onClick={() => handleProviderSignUp(doSignInWithGoogle)} className="btn btn-dark mx-1">
                                <i className="fab fa-google"></i>
>>>>>>> 4fd6871e078023400cec1cca8871ad979baed676
                            </button>
                            <button onClick={() => handleProviderSignUp(doSignInWithFacebook)} className="btn btn-dark mx-1">
                                <i className="fab fa-facebook-f"></i>
                            </button>
                            <button onClick={() => handleProviderSignUp(doSignInWithGithub)} className="btn btn-dark mx-1">
                                <i className="fab fa-github"></i>
                            </button>
                        </div>
                        
                        <p className="text-center">or:</p>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        
                        <div className="form-outline mb-4">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                            <label>Email</label>
                        </div>
                        <div className="form-outline mb-4">
                            <input type={visible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                            <label>Password</label>
                            <div style={{ position: 'relative', left: '88%', transform: 'translateY(-235%)', cursor: 'pointer' }} onClick={() => setVisible(!visible)}>
                                {visible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary btn-block mb-4">
                            {isRegistering ? "Sign up" : "Sign in"}
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
