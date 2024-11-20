import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/dashboard.css";

export const Balance = () => {
	const { store, actions } = useContext(Context);
	const [currentBalance, setCurrentBalance] = useState(store.balance);
	const [loadingSources, setLoadingSources] = useState(true);
	const [loadingTransactions, setLoadingTransactions] = useState(false);
	const [currentSource, setCurrentSource] = useState(null)

	const formatSourceNumber = (number) => {
		/* aqui en vez de es-ES para españa he puesto de-DE de alemania que formatea mejor el "currency". */
		return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', currencyDisplay: 'symbol' }).format(number);
	};

	const handleSourceClick = async (source) => {
		setCurrentSource(source);
		setCurrentBalance(source.amount);
		setLoadingTransactions(true);
		await actions.getTransactionsBySource(source.id);
		setLoadingTransactions(false);
	};

	const filteredTransactions = currentSource
		? store.transactions.filter((transaction) => transaction.source_id === currentSource.id)
		: store.transactions;

	useEffect(() => {
		actions.getTransactions();
		actions.getBudgets();
		actions.getBalance();
		actions.getInstitutions();
		const fetchData = async () => {
			await actions.getSources();
			setLoadingSources(false);
		}
		fetchData();
	}, [])


	return (
		<>
			<div className="container my-4">

				{/* title */}
				<div className="row mb-2"><h2>Dashboard</h2></div>

				<div className="container my-4">

					{/* Row for Horizontal Cards */}
					<div className="row">

						{/* Card 1 */}
						<div className="col-md-4">
							<div className="card text-center">
								<div className="card-body">
									<h4 className="card-title mb-3">Balance</h4>
									<div className="dropdown">
										<button
											className="btn btn-secondary dropdown-toggle btn-sm"
											type="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
											style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>
											{currentSource ? currentSource.name : "Select a source"}
										</button>
										<ul className="dropdown-menu bg-light">
											{/* Add Total option */}
											<li>
												<a
													className="dropdown-item"
													href="#"
													onClick={() => {
														setCurrentSource(null); // Clear current source
														setCurrentBalance(
															store.sources.reduce((sum, source) => sum + source.amount, 0) // Calculate total
														);
													}}
												>
													Total
												</a>
											</li>
											{/* Render sources */}
											{store.sources.length > 0 ? (
												store.sources.map((source) => (
													<li key={`source-${source.id}`}>
														<a
															className="dropdown-item"
															href="#"
															onClick={() => handleSourceClick(source)}
														>
															{source.name}
														</a>
													</li>
												))
											) : (
												<li>
													<a className="dropdown-item" href="#">
														No sources available
													</a>
												</li>
											)}
										</ul>
									</div>

									<h5 className="pt-3">
										<span style={{ color: "grey" }}> </span>
										{currentBalance !== null && !isNaN(currentBalance)
											? `${formatSourceNumber(currentBalance)}`
											: `Total: ${formatSourceNumber(
												store.sources.reduce((sum, source) => sum + source.amount, 0)
											)}`}
									</h5>
									<ul className="list-group list-group-flush">
										{filteredTransactions.length > 0 ? (
											filteredTransactions.slice(0, 4).map((transaction, index) => (
												<li
													key={`transaction-${index}`}
													className="list-group-item d-flex justify-content-between align-items-start"
												>
													<div className="ms-2 me-auto">
														<p className="fw-light">{new Date(transaction.date).toLocaleDateString('es-ES')}</p>
													</div>
													<span
														className=""
														style={{ color: transaction.type === 'income' ? "green" : "red" }}
													>
														{!isNaN(transaction.amount) ? formatSourceNumber(transaction.amount) : "Invalid"}
													</span>
												</li>
											))
										) : (
											<li className="list-group-item d-flex justify-content-between align-items-start">
												<div className="ms-2 me-auto mt-2">
													<p>You don't have any transactions</p>
												</div>
											</li>
										)}
									</ul>
								</div>
							</div>
						</div>

						{/* Card 2 */}
						<div className="col-md-4">
							<div className="card text-center">
								<div className="card-body">
									<h4 class="card-title mb-3">Biggest budget</h4>
									{/* Find the budget with the highest budget_amount */}
									{store.budgets.length > 0 ? (
										(() => {
											const highestBudget = store.budgets.reduce(
												(max, budget) =>
													budget.budget_amount > max.budget_amount ? budget : max,
												store.budgets[0] // Initial value is the first budget
											);

											return (
												<div>
													<h5>{highestBudget.category_name || "Uncategorized"}</h5>
													<p>
														<strong>Amount:</strong> {highestBudget.budget_amount.toLocaleString("es-ES")} €
													</p>
													<p>
														<strong>Target Period:</strong>{" "}
														{new Date(highestBudget.target_period).toLocaleDateString("es-ES")}
													</p>
													<p>
														<strong>Total Expense:</strong> {(highestBudget.total_expense || 0).toLocaleString("es-ES")} €
													</p>
												</div>
											);
										})()
									) : (
										<p>No budgets available</p>
									)}
								</div>
							</div>
						</div>

						{/* Card 3 */}
						<div className="col-md-4">
							<div className="card text-center">
								<div className="card-body">
									<h4 className="card-title">Connected Banks</h4>
									{store.connections && store.connections.length > 0 ? (
										<ul className="list-group list-group-flush">
											{store.connections.map((connection) => {
												const institution = store.institutions.find(
													(inst) => inst.id === connection.institution_id
												);
												return (
													<li key={connection.id} className="list-group-item d-flex align-items-center">
														{institution && institution.icon && (
															<img
																src={institution.icon}
																alt={`${institution.name} logo`}
																style={{
																	width: "25px",
																	height: "25px",
																	marginRight: "10px",
																}}
															/>
														)}
														<div>
															<strong>{institution ? institution.name : "Unknown Bank"}</strong>
															{connection.consent_token ? (
																<span className="text-success ms-2">(Connected)</span>
															) : (
																<span className="text-danger ms-2">(Not Authorized)</span>
															)}
														</div>
													</li>
												);
											})}
										</ul>
									) : (
										<p className="text-muted">No banks connected yet.</p>
									)}
								</div>
							</div>
						</div>


					</div>
				</div>

			</div >
		</>
	);
};

