import React from "react";
import { Link } from "react-router-dom";
import "../../styles/nav.css";
import logoExpenseVue from "../../img/ExpenseVue-Logo.png";


export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light" aria-label="Offcanvas navbar large" style={{ backgroundColor: '#F9D423' }}>
			<div className="container">
				<Link to="/" className="navbar-brand">
					<img className="mx-4" height="70" src={logoExpenseVue} />
				</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2">
					<span className="navbar-toggler-icon" style={{ color: 'black' }}></span>
				</button>
				<div className="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
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
								<Link className="nav-link fw-bold" to="/faq">
									FAQ
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link fw-bold" to="/contact">
									Contact
								</Link>
							</li>
							<li className="nav-item">
								<div>
									<Link to="/login">
										<button id="boton-login" className="btn fw-bold">
											Login
										</button>
									</Link>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>

	);
};
