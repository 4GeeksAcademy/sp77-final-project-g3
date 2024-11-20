import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/sidebar.css";
import logoExpenseVue from "../../img/ExpenseVue-Logo.png";
import userImg from "../../img/user-img.png";
import { doSignOut } from "../../../firebase/auth"; // Import sign-out function

export const Sidebar = () => {
    const { store, actions } = useContext(Context);
    const profileImage = store.user?.photo_url || userImg;

    const handleLogout = async () => {
        try {
            await doSignOut();
            actions.logout(); // Llama al logout del Flux para limpiar el store y localStorage
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    const handleTransactions = () => {
        actions.getTransactions();
        actions.getBalance();
    }

    return (

        <>
            {/* Sidebar para pantallas grandes */}
            <div className="sidebar-container d-none d-lg-block">
                <Link to="/" className="navbar-brand">
                    <img className="mb-4 mt-2 mx-5" height="80" src={logoExpenseVue} alt="Logo ExpenseVue" />
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto list-unstyled sidebar-content">
                    <li className="nav-item mb-3 ms-2">
                        <Link className="fw-bold sidebar-link" to="/">
                            <i className="fa-solid fa-home bi pe-none me-2"></i> Home
                        </Link>
                    </li>
                    <li className="mb-3 ms-2">
                        <Link className="fw-bold sidebar-link" to="/dashboard">
                            <i className="fa-solid fa-table-columns bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                            Dashboard
                        </Link>
                    </li>
                    <li className="mb-3 ms-2">
                        <Link className="fw-bold sidebar-link" to="/transactions" onClick={handleTransactions}>
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
                        <Link className="fw-bold sidebar-link" to="/categories">
                            <i className="fa-solid fa-layer-group bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                            Categories
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
                    <a
                        href="#"
                        className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
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

            {/* Sidebar con menú hamburguesa para móviles */}
            <nav className="bg-mobile navbar navbar-expand-lg navbar-dark bg-dark d-lg-none">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        <img height="50" src={logoExpenseVue} alt="Logo ExpenseVue" />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasSidebar"
                        aria-controls="offcanvasSidebar"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="offcanvas offcanvas-start text-bg-dark"
                        tabIndex="-1"
                        id="offcanvasSidebar"
                        aria-labelledby="offcanvasSidebarLabel"
                    >
                        <div className="offcanvas-header">
                            <Link to="/" className="navbar-brand">
                                <img height="50" src={logoExpenseVue} alt="Logo ExpenseVue" />
                            </Link>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="nav flex-column">
                                <li className="nav-item mb-3 ms-2">
                                    <Link className="fw-bold sidebar-link" to="/">
                                        <i className="fa-solid fa-home bi pe-none me-2"></i> Home
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
                                    <Link className="fw-bold sidebar-link" to="/categories">
                                        <i className="fa-solid fa-layer-group bi pe-none me-2" style={{ width: '16', height: '16' }}></i>
                                        Categories
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
                                <a
                                    href="#"
                                    className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
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
                    </div>
                </div>
            </nav>
        </>
    );
};
