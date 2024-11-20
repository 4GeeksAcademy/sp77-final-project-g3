import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/nav.css";
import logoExpenseVue from "../../img/ExpenseVue-Logo.png";
import { useAuth } from "../../../contexts/authContext/index.jsx";
import { doSignOut } from "../../../firebase/auth";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const { user, isLogged } = store;
    const { currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            await actions.logout();
            console.log("User logged out");
            window.location.reload(); // Recarga la página
        } catch (error) {
            console.error("Error logging out:", error.message);
            window.alert("An error occurred during logout. Please try again.");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light" aria-label="Offcanvas navbar large" style={{ backgroundColor: '#ffc107' }}>
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <img className="mx-4" height="70" src={logoExpenseVue} alt="ExpenseVue Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2">
                    <span className="navbar-toggler-icon" style={{ color: 'black' }}></span>
                </button>
                <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
                    <div className="offcanvas-header">
                        <Link to="/" className="navbar-brand">
                            <img className="mb-4 mt-2 mx-5" height="80" src={logoExpenseVue} alt="Logo ExpenseVue" />
                        </Link>                        <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <Link className="nav-link fw-bold" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-bold" to="/faq">
                                    FAQ
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-bold" to="/contact">
                                    Contact
                                </Link>
                            </li>
                            {isLogged && (
                                <li className="nav-item me-3">
                                    <Link to="/dashboard">
                                        <button id="boton-dashboard" className="btn fw-bold">
                                            Go to Dashboard
                                        </button>
                                    </Link>
                                </li>
                            )}
                            <li className="nav-item">
                                {isLogged ? (
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
