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
import { EditTransaction } from "./pages/EditTransaction.jsx";
import { EditCategory } from "./pages/EditCategory.jsx";
import { Categories } from "./pages/Categories.jsx";
import { Error404 } from "./pages/Error404.jsx";
import { ProtectedRoute } from "./pages/ProtectedRoute.jsx";
import { PasswordRecovery } from "./pages/PasswordRecovery.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";
import { EditBudget } from "./pages/EditBudget.jsx";
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
                            <Route path="/forgot-password" element={<PasswordRecovery />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                        </Route>
                        {/* Rutas con Sidebar */}
                        <Route element={<SidebarLayout />}>
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                            <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
                            <Route path="/balance" element={<ProtectedRoute><Balance /></ProtectedRoute>} />
                            <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/edit-transaction" element={<ProtectedRoute><EditTransaction /></ProtectedRoute>} />
                            <Route path="/edit-category" element={<ProtectedRoute><EditCategory /></ProtectedRoute>} />
                            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                            <Route path="/edit-budget/:id" element={<ProtectedRoute><EditBudget /></ProtectedRoute>} />
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
