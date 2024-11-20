import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import '../../styles/transactions.css';
import { useNavigate } from "react-router-dom";

export const EditTransaction = () => {
    const { store, actions } = useContext(Context);
    const currentTransaction = store.currentTransaction || {};
    const [name, setName] = useState(currentTransaction.name || '');
    const [type, setType] = useState(currentTransaction.type || '');
    const [category, setCategory] = useState(currentTransaction.category || '');
    const [source, setSource] = useState(currentTransaction.source || '');
    const [description, setDescription] = useState(currentTransaction.description || '');
    const [amount, setAmount] = useState(currentTransaction.amount || '');
    const [date, setDate] = useState(currentTransaction.date || '');
    const navigate = useNavigate();

   

    const handleSubmit = (event) => {
        event.preventDefault();

        const dataToSend = {
            name: name,
            type: type,
            category_id: category,
            source_id: source,
            description: description,
            amount: parseFloat(amount),
            date: date,
        }
        console.log("Current transaction:", currentTransaction);
        console.log("Current transaction id:", currentTransaction.id);
        actions.editTransaction(currentTransaction.id, dataToSend);
        actions.getTransactions();
        navigate('/transactions')
    }

    const handleTransactions = () => {
        actions.getTransactions();
        actions.getCurrentTransactions();
    }

    const handleReset = () => { navigate('/transactions') };

    return (
                        <form onSubmit={handleSubmit}>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerName">Name<span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerType">Type of Transaction<span className="required">*</span></label>
                                <select className="form-select" aria-label="Default select example" value={type}
                                    onChange={(event) => setType(event.target.value)} required >
                                    <option value="">Choose a type of Transaction</option>
                                    <option value="expense">expense</option>
                                    <option value="income">income</option>
                                </select>
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerCategory">Category:<span className="required">*</span></label>
                                <select className="form-select" aria-label="Default select example" value={category} onChange={(e) => setCategory(e.target.value)} required >
                                    <option value="">Select a category</option>
                                    {store.categories && store.categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerCategory">Source:<span className="required">*</span></label>
                                <select className="form-select" aria-label="Default select example" value={source} onChange={(e) => setSource(e.target.value)}>
                                    <option value="">Select a source</option>
                                    {store.sources && store.sources.map((source) => (
                                        <option key={source.id} value={source.id}>{source.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label">Description:</label>
                                <textarea
                                    className="form-control textarea"
                                    name="description"
                                    aria-label="With textarea"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerAmount">Amount<span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="amount"
                                    name="amount"
                                    className="form-control"
                                    value={amount}
                                    onChange={(event) => setAmount(event.target.value)}
                                    required 
                                />
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="registerDate">Date<span className="required">*</span></label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    className="form-control"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)}
                                    required />
                            </div>
                            <div className="modal-footer">
                                <button type="reset" onClick={handleReset} className="btn btn-danger">Cancel </button>
                                <button type="submit" className="btn" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} onClick={handleTransactions}>Edit Transaction</button>
                            </div>
                        </form>
    )
}
