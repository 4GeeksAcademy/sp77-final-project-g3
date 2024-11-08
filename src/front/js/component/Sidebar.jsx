import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { useContext } from "react";
import "../../styles/sidebar.css";
import logoExpenseVue from "../../img/ExpenseVue-Logo.png";
import userImg from "../../img/user-img.png";
import { doSignOut } from "../../../firebase/auth"; // Import sign-out function

export const Sidebar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await doSignOut();
            console.log("User logged out");
            actions.logout(); // Llama al logout del Flux para limpiar el store y localStorage
            navigate('/'); // Redirige al usuario después de la limpieza
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    const profileImage = store.user?.photo_url || userImg;

    return (
        <div className="sidebar-container">
            <Link to="/" className="navbar-brand">
                <img className="mb-4 mt-2 mx-5" height="80" src={logoExpenseVue} alt="Logo ExpenseVue" />
            </Link>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto list-unstyled sidebar-content">
                <li className="nav-item mb-3 ms-2">
                    <Link className="fw-bold sidebar-link" to="/">
                        <i className="fa-solid fa-home bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                        Home
                    </Link>
                </li>
                <li className="mb-3 ms-2">
                    <Link className="fw-bold sidebar-link" to="/dashboard">
                        <i className="fa-solid fa-table-columns bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                        Dashboard
                    </Link>
                </li>
                <li className="mb-3 ms-2">
                    <Link className="fw-bold sidebar-link" to="/transactions">
                        <i className="fa-solid fa-money-bill-transfer bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                        Transactions
                    </Link>
                </li>
                <li className="mb-3 ms-2">
                    <Link className="fw-bold sidebar-link" to="/budgets">
                        <i className="fa-solid fa-sack-dollar bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                        Budgets
                    </Link>
                </li>
                <li className="mb-3 ms-2">
                    <Link className="fw-bold sidebar-link" to="/balance">
                        <i className="fa-solid fa-scale-balanced bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                        Balance
                    </Link>
                </li>
                <li className="mb-3 ms-2">
                    <Link className="fw-bold sidebar-link" to="/connections">
                        <i className="fa-solid fa-circle-nodes bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                        Connections
                    </Link>
                </li>
                <li className="mb-3 ms-2">
                    <Link className="fw-bold sidebar-link" to="/faq">
                        <i className="fa-solid fa-circle-question bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                        FAQ
                    </Link>
                </li>
                <li className="mb-3 ms-2">
                    <Link className="fw-bold sidebar-link" to="/contact">
                        <i className="fa-solid fa-envelope bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                        Contact
                    </Link>
                </li>
            </ul>
            <hr />
            <div className="dropdown mb-3 ms-2">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={profileImage} alt="User profile" width="32" height="32" className="rounded-circle me-2" />
                    <strong className="user-settings">{store.user?.first_name} {store.user?.last_name}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" onClick={handleLogout} href="#">Sign out</a></li>
                </ul>
            </div>
            <div className="sidebar-footer">
                <span>© ExpenseVue</span>
            </div>
        </div>
    );
};
