import React from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import injectContext from "./store/appContext";
// Custom components
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import { Sidebar } from "./component/Sidebar.jsx";
// Custom pages / views
import { Home } from "./pages/Home.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Login } from "./pages/Login.jsx";
import { Faq } from "./pages/Faq.jsx";
import { Transactions } from "./pages/Transactions.jsx";
import { Budgets } from "./pages/Budgets.jsx";
import { Balance } from "./pages/Balance.jsx";
import { Connections } from "./pages/Connections.jsx";
import { Contact } from "./pages/Contact.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Error404 } from "./pages/Error404.jsx";
import { AuthProvider } from "../../contexts/authContext/index.jsx";

// Layout con Navbar y Footer
const NavbarFooterLayout = () => (
    <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Outlet /> 
        <Footer />
    </div>
);

// Layout con Sidebar
const SidebarLayout = () => (
    <div className="main-content">
        <Sidebar />
        <Outlet /> 
    </div>
);

// Componente principal
const Layout = () => {
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <AuthProvider>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        {/* Rutas con Navbar y Footer */}
                        <Route element={<NavbarFooterLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/faq" element={<Faq />} />
                            <Route path="/contact" element={<Contact />} />
                        </Route>

                        {/* Rutas con Sidebar */}
                        <Route element={<SidebarLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/budgets" element={<Budgets />} />
                            <Route path="/balance" element={<Balance />} />
                            <Route path="/connections" element={<Connections />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        {/* Ruta para Not Found */}
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default injectContext(Layout);
