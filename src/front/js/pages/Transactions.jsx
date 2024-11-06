import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import '../../styles/transactions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faCircleArrowDown, faBuildingColumns, faCreditCard, faMoneyBills } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from "../component/Spinner.jsx";

export const Transactions = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="transactions-container">
			<div>
				<header className="transactions-header">
					<h1>Transactions</h1>
					<p>Welcome to your transactions</p>
					<div className="card mb-2">
						{!store.balance || Object.keys(store.balance).length === 0 ? <div className="m-3"> <Spinner /> </div> :
							(<div className="card-body d-flex flex-row align-items-center justify-content-center">
								<div className="stat me-3 d-flex flex-row  align-items-center justify-content-center">
									<div className="m-1">
										<FontAwesomeIcon icon={faCircleArrowUp} style={{ color: "#3eac65", fontSize: "2rem" }} />
									</div>
									<div >
										<p> Income</p>
										<p>€{store.balance.monthly_income}</p>
									</div>
								</div>
								<div className="stat ms-3">
									<p><FontAwesomeIcon icon={faCircleArrowDown} style={{ color: "#ea1a2f" }} /> Expenses</p>
									<p>€{store.balance.monthly_expenses}</p>
								</div>
								<div className="stat ms-3">
									<p><FontAwesomeIcon icon={faCircleArrowDown} style={{ color: "#ea1a2f" }} /> Balance</p>
									<p>€{store.balance.total_balance}</p>
								</div>
							</div>)}
					</div>
				</header>
				<div className="transactions-list card">
					<table>
						<thead>
							<tr>
								<th>Transaction</th>
								<th>Mode</th>
								<th>Date</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{!store.transactions || store.transactions.length === 0 ? (
								<tr>
									<td colSpan="4" >  <div className="m-3"> <Spinner />  </div></td>
								</tr>
							) : (
								store.transactions.map((item, index) => (
									<tr key={index}>
										<td>{item.name}</td>
										<td>
											{(() => {
												switch (item.source.type_source) {
													case 'bank_account':
														return <FontAwesomeIcon icon={faBuildingColumns} />;
													case 'credit_card':
														return <FontAwesomeIcon icon={faCreditCard} />;
													case 'debit_card':
														return <FontAwesomeIcon icon={faCreditCard} />;
													case 'manual_entry':
														return <FontAwesomeIcon icon={faMoneyBills} />;
													default:
														return null;
												}
											})()}
										</td>
										<td>{item.date}</td>
										<td className="amount">
											{item.type === 'income' ? `€${item.amount}` : `-€${item.amount}`}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
