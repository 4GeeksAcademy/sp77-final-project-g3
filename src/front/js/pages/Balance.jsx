import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";


export const Balance = () => {
	const { store, actions } = useContext(Context);
	const [currentBalance, setCurrentBalance] = useState(store.balance);
	const [loadingSources, setLoadingSources] = useState(true);
	const [loadingTransactions, setLoadingTransactions] = useState(false);
	const [currentSource, setCurrentSource] = useState(null)

	const formatSourceNumber = (number) => {
		/* aqui en vez de es-ES para españa he puesto de-DE de alemania que formatea mejor los numeros. */
		return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
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
		actions.getBalance();
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
				<div className="row mb-2"><h2>Balance</h2></div>

				{/* source select */}
				<div className="row mb-4">
					<div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>
							{currentSource ? currentSource.name : "Select a source"}
						</button>
						<ul className="dropdown-menu bg-light">
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
						{/* <ul className="dropdown-menu bg-light">
							{store.sources.length > 0 ? (
								store.sources.map((source, index) =>
									(<li key={source.id}><a className="dropdown-item"> {source.name} </a></li>)))
								:
								(<li><a className="dropdown-item" href="#">add a source</a></li>)}
						</ul> */}
					</div>
				</div>

				{/* balance number*/}
				<div className="row d-inline-flex mb-4" style={{ display: "flex", alignItems: "center" }} >
					<h1><span style={{ color: "grey" }}>€ </span>{currentBalance !== null && !isNaN(currentBalance) ? formatSourceNumber(currentBalance) : "0"}</h1>
				</div>

				{/* Transactions */}
				<div className="row">
					<div className="card">

						<ul className="list-group list-group-flush">

							{filteredTransactions.length > 0 ? (filteredTransactions.map((transaction, index) => (
								<li 
								key={`transaction-${index}`}
								className="list-group-item d-flex justify-content-between align-items-start">
									<div className="ms-2 me-auto">
										<p className="fw-light">{new Date(transaction.date).toLocaleString('es-ES')}</p>
									</div>
									<span className="" style={{ color: transaction.type === 'income' ? "green" : "red" }}>
										{!isNaN(transaction.amount) ? formatSourceNumber(transaction.amount) : "Invalid"}
									</span>
								</li>
							)))
								:
								(<li className="list-group-item d-flex justify-content-between align-items-start">
									<div className="ms-2 me-auto mt-2">
										<p>You don't have any transactions</p>
									</div>
								</li>)}

						</ul>
					</div>

				</div>

			</div >
		</>
	);
};

