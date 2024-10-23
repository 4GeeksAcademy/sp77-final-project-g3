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
import { Demo } from "./pages/Demo.jsx";
import { Single } from "./pages/Single.jsx";
import { Login } from "./pages/Login.jsx";

// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
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
                        {/* Otras rutas con solo Sidebar */}
                        <Route path="/demo" element={
                            <div className="d-flex">
                                <Sidebar />
                                <Demo />
                            </div>
                        }
                        />
                        <Route path="/single/:theid" element={
                            <div className="d-flex">
                                <Sidebar />
                                <Single />
                            </div>
                        }
                        />
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
