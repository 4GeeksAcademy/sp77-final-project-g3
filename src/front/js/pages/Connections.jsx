import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "../component/Spinner.jsx";


export const Connections = () => {
	const { store, actions } = useContext(Context);
	const location = useLocation();
	const navigate = useNavigate();
	const institutions = store.institutions;
	const connections = store.connections;
	const sources = store.sources;
	const transactions = store.transactions;
	const [bank, setBank] = useState('');
	const [confirmingBank, setConfirmingBank] = useState(false);
	const [name, setName] = useState('');
	const [type, setType] = useState('');
	const [amount, setAmount] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		actions.getConnections();
		actions.getSources();
		const userId = store.user?.id || localStorage.getItem("user_id");
		if (userId) {
			actions.getUser(userId).finally(() => setLoading(false));
		} else {
			setError("No se encontró el ID de usuario");
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const consentToken = queryParams.get('consent');
		const institutionId = queryParams.get('institution');
		if (consentToken && institutionId) {
			setConfirmingBank(true);
		}
	}, []);

	const createYapilyUser = async () => {
		await actions.createYapilyUser(store.user.id);
		window.location.reload();
	};

	const handleAuthorization = async (event) => {
		event.preventDefault();
		if (!bank) {
			alert('Please, select a bank!')
			return
		}
		const response = await actions.getBankAuthorization(bank);
		if (response && response.authorisationUrl) {
			window.location.href = response.authorisationUrl;
		} else {
			alert("You couldn't get the authorization, please try again!");
		}
	}

	const bankConfirmation = () => {
		const queryParams = new URLSearchParams(location.search);
		const consentToken = queryParams.get('consent');
		const institutionId = queryParams.get('institution');
		actions.getConsentToken(consentToken, institutionId);
		setConfirmingBank(false);
		navigate('/connections');
		window.location.reload();
	}

	const getBankAccounts = async (consentToken) => {
		setLoading(true);
		const success = await actions.getBankAccounts(consentToken);
		if (success) {
			alert('Accounts added successfully!');
			setLoading(false);
		} else {
			alert('The action failed...');
		}
	}

	const getBankTransactions = async (consentToken, sourceId) => {
		setLoading(true);
		const success = await actions.getBankTransactions(consentToken, sourceId);
		if (success) {
			alert('Transactions added successfully!');
			setLoading(false);
		} else {
			alert('The action failed...');
		}
	}

	const removeConnection = (id) => {
		actions.deleteConnection(id);
	}

	const addSource = (event) => {
		event.preventDefault();
		const sourceData = {
			name: name,
			type_source: type,
			amount: parseFloat(amount)
		}
		actions.createSource(sourceData);
		const modal = document.getElementById("NewSourceModal");
		if (modal) {
			const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
			if (bootstrapModal) bootstrapModal.hide();
		}
		setName('');
		setType('');
		setAmount('');
	}

	const editSource = (item) => {
		const editedItem = {
			id: item.id,
			name: item.name,
			type_source: item.type_source,
			amount: parseFloat(item.amount)
		}
		actions.setCurrentSource(editedItem);
		navigate('/edit-source');
	}

	const removeSource = (id) => {
		actions.deleteSource(id);
	}

	if (loading) return <Spinner />

	return (
		<>
			{!confirmingBank ? (
				<div className="container py-5">
					<div className="text-center mb-4">
						<h2>Connections</h2>
						<p className="text-muted">
							Here, you can connect with your banks.<br />
							{store.user.yapily_username ? 'Please, select one of our available institutions and add it to your connections!' : ''}
						</p>
					</div>
					{!store.user.yapily_username ? (
						<div className="d-flex justify-content-center">
							<button className="btn connection-btn fw-bold" onClick={createYapilyUser}>
								Connect
							</button>
						</div>
					) : (
						<>
							<div className="d-flex justify-content-center">
								<form className="col-6 text-center" onSubmit={handleAuthorization}>
									<select className="form-select" aria-label="Default select example" value={bank} onChange={(e) => setBank(e.target.value)}>
										{Array.isArray(institutions) && Array.isArray(connections) && institutions.some(
											institution => !connections.some(connection => connection.institution_id === institution.id)
										) ? (
											<>
												<option value="" disabled>Select your bank</option>
												{institutions.filter(institution => !connections.some(connection => connection.institution_id === institution.id)).map(institution => (
													<option key={institution.id} value={institution.yapily_id}>{institution.name}</option>
												))}
											</>
										) : (
											<option value="" disabled>We don't have more banks currently.</option>
										)}
									</select>
									<button type="submit" className="btn connection-btn fw-bold mt-3">
										Ask for authorization
									</button>
								</form>
							</div>
							<div className="mt-5">
								<p className="text-muted text-center">
									If you couldn't find your bank in our available institutions or you just need to do a manual entry, please add your source here.
									<button type="button" className="btn connection-btn ms-2" data-bs-toggle="modal" data-bs-target="#NewSourceModal"><i className="fas fa-plus"></i></button>
								</p>
								<div className="modal fade" id="NewSourceModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
									<div className="modal-dialog">
										<div className="modal-content">
											<div className="modal-header">
												<h5 className="modal-title" id="exampleModalLabel">New Source</h5>
												<button type="reset" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
											</div>
											<div className="modal-body">
												<form onSubmit={addSource}>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerName">Name<span className="required">*</span></label>
														<input type="text" id="name" className="form-control" value={name} onChange={(event) => setName(event.target.value)} required/>
													</div>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerType">Type of the Source<span className="required">*</span></label>
														<select className="form-select" aria-label="Default select example" value={type} onChange={(event) => setType(event.target.value)}required>
															<option value="" disabled>Choose the type of the source</option>
															<option value="bank_account">Bank Account</option>
															<option value="credit_card">Credit Card</option>
															<option value="debit_card">Debit Card</option>
															<option value="manual_entry">Manual Entry</option>
															<option value="others">Other</option>
														</select>
													</div>
													<div className="form-outline mb-4">
														<label className="form-label" htmlFor="registerAmount">Amount<span className="required">*</span></label>
														<input type="text" id="amount" className="form-control" value={amount} onChange={(event) => setAmount(event.target.value)} required/>
													</div>
													<div className="modal-footer">
														<button type="submit" className="btn" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>Add Source</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="text-center mt-5">
								<h5>Connected banks</h5>
								{Array.isArray(connections) && connections.some((connection) => connection.consent_token) ?
									<div className="accordion" id="accordionExample">
										{connections.filter((connection) => connection.consent_token).map((connection) => {
											const institution = institutions.find((institution) => institution.id === connection.institution_id)
											if (!institution) {
												return null
											}
											return (
												<div className="accordion-item" key={connection.id}>
													<h2 className="accordion-header">
														<button className="accordion-button connection-accordion" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${connection.id}`} aria-expanded="true" aria-controls={`collapse${connection.id}`}>
															<img src={institution.icon} width="25" className="me-3" /> {institution.name}
														</button>
													</h2>
													<div id={`collapse${connection.id}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
														<div className="accordion-body" style={{ overflow: 'auto' }}>
															{Array.isArray(sources) && sources.some((source) => source.connection_id == connection.id) ?
																<>
																	<table className="table table-hover">
																		<tbody>
																			{sources.filter((source) => source.connection_id === connection.id).map((source, index) => {
																				const hasTransactions = Array.isArray(transactions) && transactions.some((transaction) => transaction.source_id === source.id)
																				return (
																					<tr key={index}>
																						<th scope="row" align="left">{index + 1}</th>
																						<td align="left">{source.name}</td>
																						<td align="right"><strong>Balance:</strong> {source.amount} <button className="btn btn-sm transaction-btn ms-5" onClick={() => getBankTransactions(connection.consent_token, source.yapily_id)}>{hasTransactions ? 'Update Transactions' : 'Add Transactions'}</button></td>
																					</tr>
																				);
																			})}
																		</tbody>
																	</table>
																	<button type="button" className="btn btn-sm btn-link text-danger justify-content-end" onClick={() => removeConnection(connection.id)}>Remove Connection</button>
																</>
																:
																<button className="btn transaction-btn btn-sm" onClick={() => getBankAccounts(connection.consent_token)}>Add Accounts</button>
															}
														</div>
													</div>
												</div>
											);
										})}
									</div>
									:
									<div className="alert alert-warning" role="alert">
										No banks connected yet.
									</div>
								}
							</div>
							{Array.isArray(sources) && sources.some((manualSource) => !manualSource.yapily_id) ?
							<div className="text-center mt-5">
								<h5>Other sources</h5>
									<div className="accordion" id="accordionExample2">
										<div className="accordion-item">
											<h2 className="accordion-header">
												<button className="accordion-button connection-accordion" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
													Manual Entries
												</button>
											</h2>
											<div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample2">
												<div className="accordion-body" style={{ overflow: 'auto' }}>
													<table className="table table-hover">
														<tbody>
															{sources.filter((source) => !source.connection_id).map((source, index) => {
																const typeSourceMap = {
																	bank_account: "Bank Account",
																	manual_entry: "Manual Entry",
																	credit_card: "Credit Card",
																	debit_card: "Debit Card",
																	others: "Other"
																}
																return (
																	<tr key={index}>
																		<th scope="row" align="left">{index + 1}</th>
																		<td align="left">{source.name} - {typeSourceMap[source.type_source]}</td>
																		<td align="right"><strong>Balance:</strong> {source.amount}</td>
																		<td align="right">
																			<button type="button" className="btn btn-warning btn-sm" onClick={() => editSource(source)}> <i className="fa-solid fa-pencil"></i> </button>
																		</td>
																		<td align="right">
																			<button type="button" className="btn btn-dark btn-sm" onClick={() => removeSource(source.id)}> <i className="fa-solid fa-trash"></i> </button>
																		</td>
																	</tr>
																);
															})}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
							</div>
							:
							''
						}
						</>
					)}
				</div>
			) : (
				<div className="container py-5">
					<div className="text-center mb-4">
						<h2>Bank Confirmation</h2>
						<p className="text-muted">
							Please, confirm to save the bank.
						</p>
						<button className="btn connection-btn fw-bold" onClick={bankConfirmation}>
							Confirm
						</button>
					</div>
				</div>
			)}
		</>
	);
};