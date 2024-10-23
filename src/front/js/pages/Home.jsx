import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import someImg from "../../img/someimage.jpg";
import "../../styles/home.css";
import { Benefits } from "../component/Benefits.jsx";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<>
			<div className="px-4 pt-5 my-1 text-center">
				<h1 className="display-4 fw-bold">Financial Management Simplified</h1>
				<div className="col-lg-6 mx-auto">
					<p className="lead mb-4">
						Managing your finances has never been easier. With our simple and intuitive platform, you can track your income and expenses, create personalized budgets, and monitor your financial health—all in one place. Take control of your finances today and start making smarter decisions for a better tomorrow.
					</p>
					<div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
						<button id="btn-register" type="button" className="btn btn-primary btn-lg px-4 me-sm-3">Get Started</button>
					</div>
				</div>
				<div className="overflow-hidden" style={{ maxHeight: '50vh' }}>
					<div className="container px-5">
						<img className="img-fluid border shadow-lg mb-4" loading="lazy" src={someImg} alt="example img" />
					</div>
				</div>
			</div>
			<hr className="dropdown-divider" />
			<div className="px-4 pt-5 my-1 text-center">
				<h2 className="display-4 fw-bold">Why Choose Us?</h2>
				<div className="col-lg-6 mx-auto">
					<p className="lead mb-4">
						Managing your finances shouldn’t be complicated. Our platform is designed with simplicity and efficiency in mind, offering powerful tools that help you stay in control of your money. Here’s why thousands of users trust us to manage their financial health:
					</p>
				</div>
			</div>
			<Benefits />
		</>
	);
};
