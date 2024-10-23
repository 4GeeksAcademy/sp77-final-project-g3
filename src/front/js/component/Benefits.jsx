import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/index.css";

export const Benefits = () => {
	return (
		<>
			<div className="container-fluid row justify-content-center align-items-md-stretch">
				<div className="col-md-6 mx-auto">
					<div className="h-100 p-5 bg-dark rounded-3">
						<h3>Easy Synchronization with Bank Accounts</h3>
						<p>Seamlessly link your bank accounts in just a few clicks. Our platform supports multiple banking institutions, ensuring that you can have all your financial data in one place. No need for manual updates—your transactions are automatically synced and displayed in real-time.</p>
					</div>
				</div>
				<div className="col-md-6 mx-auto">
					<div className="bg-success h-100 p-5 border rounded-3">
						<h3>Automatic Expense Tracking</h3>
						<p>Forget about the hassle of manually logging every transaction. With our automatic expense tracking feature, you can easily monitor where your money is going. Expenses are categorized instantly, giving you full visibility into your spending habits without any extra effort.</p>
					</div>
				</div>
			</div>
			<div className="container-fluid row justify-content-center align-items-md-stretch py-3">
				<div className="col-md-6 mx-auto">
					<div className="h-100 p-5 bg-warning rounded-3">
						<h3>Expense Analysis by Category</h3>
						<p>Take a deep dive into your spending with detailed analysis by category. Whether it's groceries, entertainment, or bills, we break down your expenses so you can identify patterns and make informed decisions. Gain insights into areas where you can save and optimize your budget.</p>
					</div>
				</div>
				<div className="col-md-6 mx-auto">
					<div className="bg-dark h-100 p-5 border rounded-3">
						<h3>Security for Your Financial Data</h3>
						<p>Your security is our top priority. We use the latest encryption technologies to ensure that your financial data is protected at all times. Our platform complies with the highest industry standards, giving you peace of mind that your information is safe and secure.</p>
					</div>
				</div>
			</div>
			<div className="container-fluid row justify-content-center align-items-md-stretch py-3">
				<div className="col-md-6 mx-auto">
					<div className="h-100 p-5 bg-success rounded-3">
						<h3>Personalized Budgeting Tools</h3>
						<p>Every individual’s financial situation is unique, and so is your budget. Our platform provides customized budgeting tools that adapt to your specific needs. Whether you’re saving for a major purchase or planning for monthly expenses, our tools help you stay on track with your financial goals.</p>
					</div>
				</div>
				<div className="col-md-6 mx-auto">
					<div className="bg-warning h-100 p-5 border rounded-3">
						<h3>Comprehensive Financial Overview</h3>
						<p>Get a clear and concise overview of your entire financial landscape. Our dashboard offers real-time data on your income, expenses, and account balances, giving you a complete picture of your financial health at a glance. Make well-informed decisions with up-to-date information at your fingertips.</p>
					</div>
				</div>
			</div>
		</>
	);
};