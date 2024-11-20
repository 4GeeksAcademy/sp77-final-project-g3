import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";


export const EditSource = () => {
    const { store, actions } = useContext(Context);
    const currentSource = store.currentSource || {};
    const [name, setName] = useState(currentSource.name || '');
    const [type, setType] = useState(currentSource.type_source || '');
    const [amount, setAmount] = useState(currentSource.amount || '');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isNaN(amount)) {
            alert('Please, enter a valid number for the amount!');
            return
        }
        const dataToSend = {
            name: name,
            type_source: type,
            amount: parseFloat(amount)
        };
        actions.editSource(currentSource.id, dataToSend);
        navigate('/connections');
    }

    const handleReset = () => {
        navigate('/connections');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-outline mb-4">
                <label className="form-label" htmlFor="registerName">Name<span className="required">*</span></label>
                <input type="text" id="name" className="form-control" value={name} onChange={(event) => setName(event.target.value)} required/>
            </div>
            <div className="form-outline mb-4">
                <label className="form-label" htmlFor="registerType">Type of the Source<span className="required">*</span></label>
                <select className="form-select" aria-label="Default select example" value={type} onChange={(event) => setType(event.target.value)} required> 
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
                <button type="reset" onClick={handleReset} className="btn btn-danger">Cancel</button>
                <button type="submit" className="btn" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>Edit Source</button>
            </div>
        </form>
    )
}