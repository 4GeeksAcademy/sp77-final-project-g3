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
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [yapilyUser, setYapilyUser] = useState(null);
	const [accounts, setAccounts] = useState(null);


	useEffect(() => {
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
		const institutionCode = queryParams.get('institution');
		if (consentToken && institutionCode) {
			setConfirmingBank(true);
		}
	}, []);


	const createYapilyUser = async () => {
		setLoading(true);
		setError(null);
		try {
			const id = store.user.id
			const result = await actions.createYapilyUser(id);
			setYapilyUser(result);
		} catch (fail) {
			setError(fail.message);
		} finally {
			window.location.reload();
		}
	};


	const handleAuthorization = async (event) => {
		event.preventDefault();
		if (!bank) {
			alert('Please, select a bank!')
			return
		}
		const response = await actions.getBankAuthorization(bank);
		if (response && response.authorisationUrl) {
			setLoading(true);
			window.location.href = response.authorisationUrl;
		} else {
			alert("You couldn't get the authorization, please try again!");
		}
	}

	const bankConfirmation = () => {
		const queryParams = new URLSearchParams(location.search);
		const consentToken = queryParams.get('consent');
		const institutionCode = queryParams.get('institution');
		actions.getConsentToken(consentToken, institutionCode);
		setConfirmingBank(false);
		navigate('/connections');
		setLoading(true);
		window.location.reload();
	}


	const getBankAccounts = async (consent) => {
		setLoading(true);
		setError(null);
		try {
			const result = await actions.getBankAccounts(consent);
			setAccounts(result);
		} catch (fail) {
			setError(fail.message);
		} finally {
			setLoading(false);
		}
	}


	const getBankTransactions = (consent, code) => {
		actions.getBankTransactions(consent, code);
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
										<option value="" disabled>Select your bank</option>
										{Array.isArray(institutions) && Array.isArray(connections) ? (
											institutions.filter((institution) =>
												!connections.some(connection => connection.institution_id === institution.id)).map((institution) => (
													<option key={`${institution.id}`} value={institution.code}>{institution.name}</option>
												))
										) : (
											<option value="" disabled>We don't have more banks currently.</option>
										)}
									</select>
									<button type="submit" className="btn connection-btn fw-bold mt-3">
										Ask for authorization
									</button>
								</form>
							</div>
							<div className="text-center mt-5">
								<h5>Connected banks</h5>
								{Array.isArray(connections) && connections.some((item) => item.consent_token) ?
									<div className="accordion" id="accordionExample">
										{connections.filter((item) => item.consent_token).map((item) => {
											const institution = institutions.find((bank) => bank.id === item.institution_id)
											if (!institution) {
												return null
											}
											return (
												<div className="accordion-item" key={item.id}>
													<h2 className="accordion-header">
														<button className="accordion-button connection-accordion" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${item.id}`} aria-expanded="true" aria-controls={`collapse${item.id}`}>
															<img src={institution.icon} width="25" className="me-3" /> {institution.name}
														</button>
													</h2>
													<div id={`collapse${item.id}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
														<div className="accordion-body">
															{Array.isArray(sources) && sources.some((element) => element.connection_id == item.id) ?
																<table className="table table-hover">
																	<tbody>
																		{sources.filter((element) => element.connection_id === item.id).map((element, index) => {
																			const hasTransactions = Array.isArray(transactions) && transactions.some((transaction) => transaction.source_id === element.id)
																			return (

																				<tr key={index}>
																					<th scope="row" align="left">{index + 1}</th>
																					<td align="left">{element.name}</td>
																					<td align="right"><strong>Balance:</strong> {element.amount} <button className="btn btn-sm transaction-btn ms-5" onClick={() => getBankTransactions(item.consent_token, element.code)}>{hasTransactions ? 'Update Transactions' : 'Add Transactions'}</button></td>
																				</tr>
																			);
																		})}
																	</tbody>
																</table>
																:
																<button className="btn transaction-btn btn-sm" onClick={() => getBankAccounts(item.consent_token)}>Add Accounts</button>
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
						<button id="boton-logout" className="btn fw-bold" onClick={bankConfirmation}>
							Confirm
						</button>
					</div>
				</div>
			)}
		</>
	);
};