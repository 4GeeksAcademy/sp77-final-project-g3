import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const PasswordRecovery = () => {
    const { actions } = useContext(Context);
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage('');
		setError('');

		try {
			await actions.passwordRecovery(email);
			setMessage("You will receive password reset instructions.");
		} catch (error) {
			if (error.message === "Email not registered.") {
				setError("This email address is not registered in our system.");
			} else {
				setError("An error occurred, please try again later.");
			}
		}
	};	

	return (
		<div className="d-flex justify-content-center align-items-center my-3">
			<div className="container-flex">
				<h1>Forgot Your Password?</h1>
				<p>
					Don’t worry! We can help you reset it.<br/><br/>
					Please enter the email address associated with your account, and we’ll send you a link to reset your password.
				</p>
				<form onSubmit={handleSubmit}>
					<div className="form-outline mb-4">
						<label className="form-label" htmlFor="email">Enter your email</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={handleEmailChange}
							className="form-control"
							required
						/>
					</div>
					<button type="submit" className="btn btn-dark btn-block">
						Send
					</button>
				</form>
				{message && <p className="mt-3" style={{ color: '#2D3748' }}>{message}</p>}
				{error && <p className="mt-3" style={{ color: 'red' }}>{error}</p>}
				<div className="mt-4">
					<Link to="/login" style={{ color: '#2D3748' }}>Back to Login</Link>
				</div>
			</div>
		</div>
	);
};
