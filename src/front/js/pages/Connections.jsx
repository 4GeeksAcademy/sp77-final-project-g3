import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";


export const Connections = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const institutions = store.institutions;
	const [bank, setBank] = useState('');
	const [haveConsent, setHaveConsent] = useState(false);


	useEffect(() => {
		actions.getInstitutions();
	}, []);


	const createYapilyUser = async () => {
		const id = store.user.id
		const success = await actions.createYapilyUser(id);
		if (success) {
			alert('Connection completed :D');
			navigate('/connections');
		} else {
			alert('Connection failed ;-;');
		}
	};


	const handleAuthorization = async (event) => {
		event.preventDefault();
		if (!bank) {
			alert('Please select a bank!')
			return
		}
		const response = await actions.getBankAuthorization(bank);
		if (response && response.authorisationUrl) {
			window.location.href = response.authorisationUrl;
		} else {
			alert('Authorisation failed ;-;');
		}
	}


	const addBankAccounts = async (consent) => {
		const success = await actions.getBankAccounts(consent);
		if (success) {
			alert('Accounts added :D');
			setHaveConsent(true);
			navigate('/connections');
		} else {
			alert('A fail occurred ;-;')
		}
	}


	return (
		<div className="container py-5">
			<div className="text-center mb-4">
				<h2>Connections</h2>
				<p className="text-muted">
					Here, you can can connect with your banks.<br />
					{store.user.yapily_id ? 'Please, select one of our available institutions and add it to your connections!' : ''}
				</p>
			</div>
			{!store.user.yapily_id ?
				<div className="d-flex justify-content-center">
					<button id="boton-logout" className="btn fw-bold" onClick={createYapilyUser}>
						Connect
					</button>
				</div>
				:
				<>
					<div className="d-flex justify-content-center">
						<form className="col-6 text-center" onSubmit={handleAuthorization}>
							<select className="form-select" aria-label="Default select example" value={bank} onChange={(e) => setBank(e.target.value)}>
								<option value="" disabled>Select your bank</option>
								{Array.isArray(institutions) && institutions.map((item, index) => (
									<option key={index} value={item.code}>{item.name}</option>
								))}
							</select>
							<button type="submit" id="boton-logout" className="btn fw-bold mt-3">
								Ask for authorization
							</button>
						</form>
					</div>
					<div className="text-center mt-5">
						<h5>Connected banks</h5>
						<ul className="list-group">
							{Array.isArray(institutions) && institutions.filter((item) => item.consent).map((item, index) => (
								<li key={index} className="list-group-item d-flex justify-content-between align-items-center">{item.name} <button className="btn btn-sm btn-primary" onClick={() => addBankAccounts(item.consent)} disabled={haveConsent}>{!haveConsent ? 'Add Accounts' : 'Accounts Added'}</button></li>
							))}
						</ul>
					</div>
				</>
			}
		</div>
	);
};