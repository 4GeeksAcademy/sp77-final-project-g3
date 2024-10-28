import React from "react";
import { Link } from "react-router-dom";
import "../../styles/nav.css";
import logoExpenseVue from "../../img/ExpenseVue-Logo.png";
import { useAuth } from "/workspaces/sp77-final-project-g3/src/contexts/authContext/index.jsx";
import { doSignOut } from "/workspaces/sp77-final-project-g3/src/firebase/auth"; // Import sign-out function

export const Navbar = () => {

    const { currentUser } = useAuth(); // Access current user state

    const handleLogout = async () => {
        try {
            await doSignOut(); // Firebase sign-out
            console.log("User logged out");
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light" aria-label="Offcanvas navbar large" style={{ backgroundColor: '#F9D423' }}>
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <img className="mx-4" height="70" src={logoExpenseVue} alt="ExpenseVue Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2">
                    <span className="navbar-toggler-icon" style={{ color: 'black' }}></span>
                </button>
                <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbar2Label">Menu</h5>
                        <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <Link className="nav-link fw-bold" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-bold" to="/">
                                    FAQ
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-bold" to="/contact">
                                    Contact
                                </Link>
                            </li>
                            <li className="nav-item">
                                {currentUser ? (
                                    <button id="boton-logout" className="btn fw-bold" onClick={handleLogout}>
                                        Logout
                                    </button>
                                ) : (
                                    <Link to="/login">
                                        <button id="boton-login" className="btn fw-bold">
                                            Login
                                        </button>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};
