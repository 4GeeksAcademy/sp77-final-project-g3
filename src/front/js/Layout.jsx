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
                        {/* Páginas con solo Navbar y Footer*/}
                        <Route path="/" element={
                            <>
                                <Navbar />
                                <Home />
                                <Footer />
                            </>
                        }
                        />
                        <Route path="/login" element={
                            <>
                                <Navbar />
                                <Login />
                                <Footer />
                            </>
                        }
                        />
                        <Route path="/faq" element={
                            <>
                                <Navbar />
                                <Faq />
                                <Footer />
                            </>
                        }
                        />
                        <Route path="/contact" element={
                            <>
                                <Navbar />
                                <Contact />
                                <Footer />
                            </>
                        }
                        />
                        {/* Otras rutas con solo Sidebar */}
                        <Route path="/dashboard" element={
                            <div className="main-content">
                                <Sidebar />
                                <Dashboard />
                            </div>
                        }
                        />
                        <Route path="/transactions" element={
                            <div className="main-content">
                                <Sidebar />
                                <Transactions />
                            </div>
                        }
                        />
                        <Route path="/budgets" element={
                            <div className="main-content">
                                <Sidebar />
                                <Budgets />
                            </div>
                        }
                        />
                        <Route path="/balance" element={
                            <div className="main-content">
                                <Sidebar />
                                <Balance />
                            </div>
                        }
                        />
                        <Route path="/connections" element={
                            <div className="main-content">
                                <Sidebar />
                                <Connections />
                            </div>
                        }
                        />
                        <Route path="/profile" element={ 
                            <div className="main-content">
                                <Sidebar />
                                <Profile />
                            </div>
                        }
                        />
                        <Route path="/edit-transaction" element={ 
                            <div className="main-content">
                                <Sidebar />
                                <EditTransaction />
                            </div>
                        }
                        />
                        <Route path="*" element={<h1>Not found!</h1>} />

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
