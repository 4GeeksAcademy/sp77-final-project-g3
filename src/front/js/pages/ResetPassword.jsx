import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const ResetPassword = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const token = new URLSearchParams(location.search).get("token");

    useEffect(() => {
        if (!token) {
            setError("Invalid token.");
            return;
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await actions.resetPassword(token, newPassword);
            alert("Password reset successfully. You will be redirected to the login page.");
            navigate("/login");
        } catch (error) {
            setMessage(error.message || "An error occurred. Please try again later.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center my-3">
            <div className="container-flex">
                <h1>Reset Your Password</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="new-password">Enter your new password</label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-dark btn-block">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};
