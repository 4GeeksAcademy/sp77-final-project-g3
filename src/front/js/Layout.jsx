import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { Transactions } from "./pages/Transactions.jsx"
import { Budgets } from "./pages/Budgets.jsx"
import { Balance } from "./pages/Balance.jsx"
import { Connections } from "./pages/Connections.jsx"
import { Contact } from "./pages/Contact.jsx";
import { AuthProvider } from "../../contexts/authContext/index.jsx";
import { Profile } from "./pages/Profile.jsx";


// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

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
                            <div className="d-flex">
                                <Sidebar />
                                <Dashboard />
                            </div>
                        }
                        />
                        <Route path="/transactions" element={
                            <div className="d-flex">
                                <Sidebar />
                                <Transactions />
                            </div>
                        }
                        />
                        <Route path="/budgets" element={
                            <div className="d-flex">
                                <Sidebar />
                                <Budgets />
                            </div>
                        }
                        />
                        <Route path="/balance" element={
                            <div className="d-flex">
                                <Sidebar />
                                <Balance />
                            </div>
                        }
                        />
                        <Route path="/connections" element={
                            <div className="d-flex">
                                <Sidebar />
                                <Connections />
                            </div>
                        }
                        />
                        <Route path="/profile" element={ 
                            <div className="d-flex">
                                <Sidebar />
                                <Profile />
                            </div>
                        }
                        />
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default injectContext(Layout);
